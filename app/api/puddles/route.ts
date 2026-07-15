import { NextResponse } from 'next/server';
import { puddleRowsToGeoJson } from '@/lib/geojson/puddles';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { PuddleRow } from '@/types/puddle';

export const dynamic = 'force-dynamic';

const PUDDLE_PHOTO_BUCKET = 'puddle-photos';
const SIGNED_PHOTO_URL_TTL_SECONDS = 60 * 60;

function parseNumberParam(value: string | null): number | null {
  if (value === null) return null;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
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
