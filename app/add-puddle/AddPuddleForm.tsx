'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Camera, CheckCircle2, Crosshair, LoaderCircle, UploadCloud } from 'lucide-react';
import styles from './page.module.css';

type LocationState = {
  latitude: string;
  longitude: string;
};

const initialLocation: LocationState = { latitude: '', longitude: '' };

export default function AddPuddleForm() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [location, setLocation] = useState<LocationState>(initialLocation);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhoto(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  }

  function useCurrentLocation() {
    setMessage(null);
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'この端末では位置情報を取得できません。緯度・経度を入力してください。' });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude.toFixed(7),
          longitude: coords.longitude.toFixed(7)
        });
        setLocating(false);
      },
      () => {
        setMessage({ type: 'error', text: '位置情報を取得できませんでした。端末の許可設定を確認してください。' });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('latitude', location.latitude);
    formData.set('longitude', location.longitude);
    if (photo) formData.set('photo', photo);

    setSubmitting(true);
    try {
      const response = await fetch('/api/puddles', { method: 'POST', body: formData });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || '登録に失敗しました。');

      form.reset();
      setPhoto(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setLocation(initialLocation);
      setMessage({ type: 'success', text: '水たまりを登録しました。ご協力ありがとうございます。' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '登録に失敗しました。'
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>1</span>
          <div>
            <h2>写真</h2>
            <p>水たまり全体が分かる写真を1枚選んでください</p>
          </div>
        </div>

        <label className={styles.photoPicker}>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="選択した水たまり" />
          ) : (
            <div className={styles.photoPlaceholder}>
              <Camera size={32} />
              <strong>写真を撮る・選ぶ</strong>
              <small>JPEG / PNG / WebP（最大10MB）</small>
            </div>
          )}
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handlePhotoChange}
            required
          />
        </label>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>2</span>
          <div>
            <h2>場所</h2>
            <p>現在地を取得するか、緯度・経度を入力してください</p>
          </div>
        </div>

        <button className={styles.locationButton} type="button" onClick={useCurrentLocation} disabled={locating}>
          {locating ? <LoaderCircle className={styles.spinner} size={19} /> : <Crosshair size={19} />}
          {locating ? '現在地を取得中…' : '現在地を使う'}
        </button>

        <div className={styles.twoColumns}>
          <label className={styles.field}>
            <span>緯度</span>
            <input
              name="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              value={location.latitude}
              onChange={(event) => setLocation((current) => ({ ...current, latitude: event.target.value }))}
              placeholder="35.681236"
              required
            />
          </label>
          <label className={styles.field}>
            <span>経度</span>
            <input
              name="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              value={location.longitude}
              onChange={(event) => setLocation((current) => ({ ...current, longitude: event.target.value }))}
              placeholder="139.767125"
              required
            />
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>3</span>
          <div>
            <h2>水たまりの状態</h2>
            <p>おおよその数値で構いません</p>
          </div>
        </div>

        <div className={styles.twoColumns}>
          <label className={styles.field}>
            <span>東西方向の大きさ（m）</span>
            <input name="rangeEwM" type="number" min="0.01" max="100" step="0.01" placeholder="2.4" required />
          </label>
          <label className={styles.field}>
            <span>南北方向の大きさ（m）</span>
            <input name="rangeNsM" type="number" min="0.01" max="100" step="0.01" placeholder="1.2" required />
          </label>
        </div>

        <div className={styles.twoColumns}>
          <label className={styles.field}>
            <span>深さ（cm）</span>
            <input name="depthCm" type="number" min="0.1" max="500" step="0.1" placeholder="4" required />
          </label>
          <label className={styles.field}>
            <span>観測日</span>
            <input name="observedOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
          </label>
        </div>
      </section>

      {message && (
        <div className={message.type === 'success' ? styles.success : styles.error} role="status">
          {message.type === 'success' && <CheckCircle2 size={20} />}
          {message.text}
        </div>
      )}

      <button className={styles.submitButton} type="submit" disabled={submitting}>
        {submitting ? <LoaderCircle className={styles.spinner} size={20} /> : <UploadCloud size={20} />}
        {submitting ? 'Supabaseへ送信中…' : '水たまりを登録する'}
      </button>
    </form>
  );
}
