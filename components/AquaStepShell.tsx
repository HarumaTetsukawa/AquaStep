'use client';

import dynamic from 'next/dynamic';

const AquaStepApp = dynamic(() => import('./AquaStepApp'), {
  ssr: false,
  loading: () => (
    <main
        style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: '#eef6ff',
        color: '#0f172a'
        }}
    >
        AquaStep を読み込み中...
    </main>
    )
});

export default function AquaStepShell() {
  return <AquaStepApp />;
}