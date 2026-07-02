'use client';

import { Camera, Crosshair, X } from 'lucide-react';
import styles from './AddPuddlePanel.module.css';

type Props = {
  onClose: () => void;
};

export default function AddPuddlePanel({ onClose }: Props) {
  return (
    <aside className={styles.panel}>
      <div className={styles.dragHandle} />

      <div className={styles.titleRow}>
        <div>
          <p>New Puddle</p>
          <h2>水たまりを追加</h2>
        </div>
        <button onClick={onClose} aria-label="閉じる">
          <X size={20} />
        </button>
      </div>

      <button className={styles.locationButton}>
        <Crosshair size={18} />
        現在地を使う
      </button>

      <div className={styles.photoBox}>
        <Camera size={26} />
        <span>写真を追加</span>
        <small>今回はフロントラフなので未接続</small>
      </div>

      <div className={styles.formGrid}>
        <label>
          場所名
          <input placeholder="例：体育館前" />
        </label>
        <label>
          大きさ cm
          <input type="number" placeholder="120" />
        </label>
        <label>
          深さ cm
          <input type="number" placeholder="4" />
        </label>
        <label>
          危険度
          <select defaultValue="medium">
            <option value="low">低い</option>
            <option value="medium">普通</option>
            <option value="high">高い</option>
          </select>
        </label>
      </div>

      <label className={styles.memoLabel}>
        メモ
        <textarea placeholder="暗い時間は見えづらい、滑りやすいなど" />
      </label>

      <button className={styles.submitButton}>仮登録する</button>
    </aside>
  );
}
