import { NextResponse } from 'next/server';
import { puddleRowsToGeoJson } from '@/lib/geojson/puddles';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { PuddleRow } from '@/types/puddle';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PUDDLE_PHOTO_BUCKET = 'puddle-photos';
const SIGNED_PHOTO_URL_TTL_SECONDS = 60 * 60;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function parseNumberParam(value: string | null): number | null {
  if (value === null) return null;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function requiredText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function parseNumber(formData: FormData, name: string): number | null {
  const value = Number(requiredText(formData, name));
  return Number.isFinite(value) ? value : null;
}

function extensionFor(photo: File): string {
  if (photo.type === 'image/png') return 'png';
  if (photo.type === 'image/webp') return 'webp';
  return 'jpg';
}

async function getPuddlePhotoUrl(puddleId: number): Promise<string | null> {
  const folder = String(puddleId);
  const { data: files, error: listError } = await supabaseAdmin.storage
    .from(PUDDLE_PHOTO_BUCKET)
    .list(folder, {
      limit: 1,
      sortBy: {
        column: 'created_at',
        order: 'desc'
      }
    });

  if (listError) {
    console.error(`Failed to list puddle photo files for ${puddleId}:`, listError);
    return null;
  }

  const file = files?.find((item) => item.id !== null);

  if (!file) {
    return null;
  }

  const path = `${folder}/${file.name}`;
  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
    .from(PUDDLE_PHOTO_BUCKET)
    .createSignedUrl(path, SIGNED_PHOTO_URL_TTL_SECONDS);

  if (signedUrlError) {
    console.error(`Failed to create signed puddle photo URL for ${path}:`, signedUrlError);
    return null;
  }

  return signedUrlData.signedUrl;
}

async function attachPuddlePhotoUrls(rows: PuddleRow[]): Promise<PuddleRow[]> {
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      image_url: row.image_url ?? (await getPuddlePhotoUrl(row.id))
    }))
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minLng = parseNumberParam(searchParams.get('minLng'));
  const maxLng = parseNumberParam(searchParams.get('maxLng'));
  const minLat = parseNumberParam(searchParams.get('minLat'));
  const maxLat = parseNumberParam(searchParams.get('maxLat'));

  let query = supabaseAdmin
    .from('puddles')
    .select('*')
    .eq('status', 'approved')
    .order('id', { ascending: true });

  if (
    minLng !== null &&
    maxLng !== null &&
    minLat !== null &&
    maxLat !== null
  ) {
    query = query
      .gte('longitude', minLng)
      .lte('longitude', maxLng)
      .gte('latitude', minLat)
      .lte('latitude', maxLat);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch puddles:', error);

    return NextResponse.json(
      { error: '水たまりデータの取得に失敗しました' },
      { status: 500 }
    );
  }

  const rows = await attachPuddlePhotoUrls((data ?? []) as PuddleRow[]);
  const geoJson = puddleRowsToGeoJson(rows);

  return NextResponse.json(geoJson, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const latitude = parseNumber(formData, 'latitude');
    const longitude = parseNumber(formData, 'longitude');
    const depthCm = parseNumber(formData, 'depthCm');
    const rangeNsM = parseNumber(formData, 'rangeNsM');
    const rangeEwM = parseNumber(formData, 'rangeEwM');
    const observedOn = requiredText(formData, 'observedOn');
    const photo = formData.get('photo');

    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json({ error: '写真を選択してください。' }, { status: 400 });
    }

    if (!ALLOWED_PHOTO_TYPES.has(photo.type) || photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: '写真は10MB以下のJPEG・PNG・WebPを選択してください。' },
        { status: 400 }
      );
    }

    if (
      latitude === null ||
      latitude < -90 ||
      latitude > 90 ||
      longitude === null ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json({ error: '緯度・経度が正しくありません。' }, { status: 400 });
    }

    if (
      depthCm === null ||
      depthCm <= 0 ||
      depthCm > 500 ||
      rangeNsM === null ||
      rangeNsM <= 0 ||
      rangeNsM > 100 ||
      rangeEwM === null ||
      rangeEwM <= 0 ||
      rangeEwM > 100
    ) {
      return NextResponse.json(
        { error: '深さまたは大きさが入力範囲外です。' },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(observedOn)) {
      return NextResponse.json({ error: '観測日が正しくありません。' }, { status: 400 });
    }

    const { data: insertedRows, error: insertError } = await supabaseAdmin
      .from('puddles')
      .insert({
        latitude,
        longitude,
        range_ns_m: rangeNsM,
        range_ew_m: rangeEwM,
        depth_cm: depthCm,
        observed_on: observedOn,
        status: 'approved'
      })
      .select('id')
      .single();

    if (insertError || !insertedRows?.id) {
      console.error('Supabase row insert failed:', insertError);

      return NextResponse.json(
        { error: '水たまり情報の保存に失敗しました。テーブル設定を確認してください。' },
        { status: 502 }
      );
    }

    const puddleId = Number(insertedRows.id);
    const objectPath = `${puddleId}/${crypto.randomUUID()}.${extensionFor(photo)}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from(PUDDLE_PHOTO_BUCKET)
      .upload(objectPath, photo, {
        contentType: photo.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Storage upload failed:', uploadError);

      await supabaseAdmin.from('puddles').delete().eq('id', puddleId);

      return NextResponse.json(
        { error: '写真のアップロードに失敗しました。Storage設定を確認してください。' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        puddle: { id: puddleId },
        photoPath: objectPath,
        photoUrl: await getPuddlePhotoUrl(puddleId)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Puddle registration failed:', error);

    return NextResponse.json(
      { error: '登録処理中に予期しないエラーが発生しました。' },
      { status: 500 }
    );
  }
}
