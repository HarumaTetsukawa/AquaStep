'use client';

import { AlertTriangle, Clock, Navigation } from 'lucide-react';
import type { Puddle } from '@/types/puddle';
import ShoeComparison from './ShoeComparison';
import RiskBadges from './RiskBadges';
import styles from './PuddleDetailSheet.module.css';

type Props = {
  puddle: Puddle | null;
  mode: 'spot' | 'navi';
};

export default function PuddleDetailSheet({ puddle, mode }: Props) {
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
