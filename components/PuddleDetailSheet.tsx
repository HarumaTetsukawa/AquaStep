'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, Navigation } from 'lucide-react';
import type { Puddle } from '@/types/puddle';
import ShoeComparison from './ShoeComparison';
import RiskBadges from './RiskBadges';
import styles from './PuddleDetailSheet.module.css';

type Props = {
  puddle: Puddle | null;
  mode: 'spot' | 'navi';
};

function getInitialHour(updatedAt: string): number {
  const time = updatedAt.split(' ')[1];
  const hour = Number(time?.split(':')[0]);

  return Number.isFinite(hour) ? hour : 12;
}

function getTimeImageFilter(hour: number): string {
  const distanceFromNoon = Math.min(Math.abs(hour - 12), 12) / 12;
  const brightness = 1 - distanceFromNoon * 0.58;
  const contrast = 1 + distanceFromNoon * 0.28;
  const saturation = 1 - distanceFromNoon * 0.3;

  return `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export default function PuddleDetailSheet({ puddle, mode }: Props) {
  const [previewHour, setPreviewHour] = useState(12);

  useEffect(() => {
    if (puddle) {
      setPreviewHour(getInitialHour(puddle.updatedAt));
    }
  }, [puddle?.id, puddle?.updatedAt]);

  const imageFilter = useMemo(() => getTimeImageFilter(previewHour), [previewHour]);

  if (!puddle) {
    return (
      <aside className={styles.sheet}>
        <h2>水たまりを選択</h2>
        <p>地図上の水たまりをタップすると、靴との比較が表示されます。</p>
      </aside>
    );
  }

  return (
    <aside className={styles.sheet}>
      <div className={styles.dragHandle} />

      <div className={styles.titleRow}>
        <div>
          <p className={styles.label}>{mode === 'navi' ? 'Route Check' : 'Selected Spot'}</p>
          <h2>{puddle.name}</h2>
        </div>
        <div className={styles.depthCircle}>
          <strong>{puddle.depthCm}</strong>
          <span>cm</span>
        </div>
      </div>

      {puddle.imageUrl && (
        <section className={styles.photoPreview}>
          <div className={styles.photoFrame}>
            <img
              src={puddle.imageUrl}
              alt={`${puddle.name}の投稿画像`}
              style={{ filter: imageFilter }}
            />
            <span className={styles.timeBadge}>{formatHour(previewHour)}</span>
          </div>

          <div className={styles.timeControl}>
            <div className={styles.timeControlHeader}>
              <strong>時間帯プレビュー</strong>
              <span>{formatHour(previewHour)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              step="1"
              value={previewHour}
              aria-label="画像の時間帯"
              onChange={(event) => setPreviewHour(Number(event.target.value))}
            />
            <div className={styles.timeTicks}>
              <span>0:00</span>
              <span>6:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>
        </section>
      )}

      <div className={styles.metaGrid}>
        <div>
          <span>大きさ</span>
          <strong>{puddle.diameterCm}cm</strong>
        </div>
        <div>
          <span>更新</span>
          <strong>{puddle.updatedAt.split(' ')[1]}</strong>
        </div>
        <div>
          <span>座標</span>
          <strong>{puddle.lat.toFixed(4)}, {puddle.lng.toFixed(4)}</strong>
        </div>
      </div>

      {mode === 'navi' && (
        <div className={styles.naviBox}>
          <Navigation size={18} />
          <div>
            <strong>この水たまりを避けるルートを表示予定</strong>
            <p>今はフロントのラフなので、ボタンだけ仮配置しています。</p>
          </div>
        </div>
      )}

      <ShoeComparison diameterCm={puddle.diameterCm} depthCm={puddle.depthCm} />

      <RiskBadges
        slipRisk={puddle.slipRisk}
        fallRisk={puddle.fallRisk}
        nightRisk={puddle.nightRisk}
      />

      <div className={styles.noteBox}>
        <AlertTriangle size={17} />
        <p>{puddle.note}</p>
      </div>

      <div className={styles.timeBox}>
        <Clock size={15} />
        <span>Last updated: {puddle.updatedAt}</span>
      </div>
    </aside>
  );
}
