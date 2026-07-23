'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, Volume2 } from 'lucide-react';
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

function getRiskLabel(risk: Puddle['nightRisk']): string {
  if (risk === 'high') return '高い';
  if (risk === 'medium') return '普通';
  return '低い';
}

function getWarningMessage(puddle: Puddle): string {
  return `ここに危険度が${getRiskLabel(puddle.nightRisk)}水たまりがあります。深さは${puddle.depthCm}センチ、大きさは${puddle.diameterCm}センチです。足元に注意してください。`;
}

export default function PuddleDetailSheet({ puddle, mode }: Props) {
  const [previewHour, setPreviewHour] = useState(12);
  const [voiceStatus, setVoiceStatus] = useState('');

  useEffect(() => {
    if (puddle) {
      setPreviewHour(getInitialHour(puddle.updatedAt));
    }
  }, [puddle?.id, puddle?.updatedAt]);

  const imageFilter = useMemo(() => getTimeImageFilter(previewHour), [previewHour]);
  const warningMessage = useMemo(() => (puddle ? getWarningMessage(puddle) : ''), [puddle]);

  function speakWarning() {
    if (!puddle || !warningMessage) return;

    if (!('speechSynthesis' in window)) {
      setVoiceStatus('このブラウザでは音声案内を利用できません。');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(warningMessage);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setVoiceStatus('音声警告を再生中');
    utterance.onend = () => setVoiceStatus('音声警告を再生しました');
    utterance.onerror = () => setVoiceStatus('音声警告を再生できませんでした');

    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (mode === 'navi' && puddle) {
      speakWarning();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [mode, puddle?.id]);

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
          <p className={styles.label}>{mode === 'navi' ? 'Voice Warning' : 'Selected Spot'}</p>
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
          <Volume2 size={18} />
          <div>
            <strong>音声警告</strong>
            <p>{warningMessage}</p>
            <button type="button" className={styles.voiceButton} onClick={speakWarning}>
              <Volume2 size={16} />
              もう一度再生
            </button>
            {voiceStatus && <span className={styles.voiceStatus}>{voiceStatus}</span>}
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
