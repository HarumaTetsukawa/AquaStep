'use client';

import styles from './ShoeComparison.module.css';

type Props = {
  diameterCm: number;
  depthCm: number;
};

const SHOE_LENGTH_CM = 27;
const SOLE_HEIGHT_CM = 3;
const UPPER_HEIGHT_CM = 8;

function getMessage(depthCm: number) {
  if (depthCm < 1) return 'ほぼ安全。靴底が少し濡れる程度です。';
  if (depthCm < SOLE_HEIGHT_CM) return '注意。靴底全体が濡れる可能性があります。';
  if (depthCm < UPPER_HEIGHT_CM) return 'やや危険。靴の側面まで濡れそうです。';
  return '危険。靴の中まで水が入る可能性があります。';
}

export default function ShoeComparison({ diameterCm, depthCm }: Props) {
  const puddleWidth = Math.max(92, Math.min(250, diameterCm * 1.45));
  const shoeWidth = Math.max(100, Math.min(190, SHOE_LENGTH_CM * 6));
  const waterHeight = Math.max(8, Math.min(110, depthCm * 13));
  const soleHeight = SOLE_HEIGHT_CM * 13;
  const upperHeight = UPPER_HEIGHT_CM * 9;

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>靴との比較</h3>
        <span>{getMessage(depthCm)}</span>
      </div>

      <div className={styles.visualGrid}>
        <div className={styles.visualBox}>
          <p>上から見た大きさ</p>
          <div className={styles.topView}>
            <div
              className={styles.puddleOval}
              style={{ width: puddleWidth, height: puddleWidth * 0.48 }}
            />
            <div className={styles.shoeTop} style={{ width: shoeWidth }} />
          </div>
          <small>水たまり {diameterCm}cm / 靴 {SHOE_LENGTH_CM}cm</small>
        </div>

        <div className={styles.visualBox}>
          <p>横から見た深さ</p>
          <div className={styles.sideView}>
            <div
              className={styles.shoeSide}
              style={{ height: soleHeight + upperHeight }}
            />
            <div className={styles.sole} style={{ height: soleHeight }} />
            <div className={styles.water} style={{ height: waterHeight }} />
          </div>
          <small>水深 {depthCm}cm / 靴底 {SOLE_HEIGHT_CM}cm</small>
        </div>
      </div>
    </section>
  );
}
