'use client';

import type { RiskLevel } from '@/types/puddle';
import styles from './RiskBadges.module.css';

type Props = {
  slipRisk: RiskLevel;
  fallRisk: RiskLevel;
  nightRisk: RiskLevel;
};

const riskText: Record<RiskLevel, string> = {
  low: '低',
  medium: '中',
  high: '高'
};

const riskClass: Record<RiskLevel, string> = {
  low: styles.low,
  medium: styles.medium,
  high: styles.high
};

export default function RiskBadges({ slipRisk, fallRisk, nightRisk }: Props) {
  return (
    <section className={styles.riskGrid}>
      <RiskBadge label="浸水" value={slipRisk === 'high' ? '高' : slipRisk === 'medium' ? '中' : '低'} level={slipRisk} />
      <RiskBadge label="スリップ" value={riskText[slipRisk]} level={slipRisk} />
      <RiskBadge label="転倒" value={riskText[fallRisk]} level={fallRisk} />
      <RiskBadge label="夜間" value={riskText[nightRisk]} level={nightRisk} />
    </section>
  );
}

function RiskBadge({ label, value, level }: { label: string; value: string; level: RiskLevel }) {
  return (
    <div className={`${styles.badge} ${riskClass[level]}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
