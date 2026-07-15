'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, MapPin, Navigation, Droplets } from 'lucide-react';
import type { Puddle, PuddleFeatureCollection } from '@/types/puddle';
import { geoJsonToPuddles } from '@/lib/geojson/puddles';
import PuddleMap from './PuddleMap';
import PuddleDetailSheet from './PuddleDetailSheet';
import AddPuddlePanel from './AddPuddlePanel';
import styles from './AquaStepApp.module.css';

type Tab = 'spot' | 'navi' | 'add';

export default function AquaStepApp() {
  const [puddles, setPuddles] = useState<Puddle[]>([]);
  const [selectedPuddle, setSelectedPuddle] = useState<Puddle | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('spot');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPuddles() {
      try {
        setIsLoading(true);

        const response = await fetch('/api/puddles', {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('水たまりデータを取得できませんでした');
        }

        const geoJson = (await response.json()) as PuddleFeatureCollection;
        const nextPuddles = geoJsonToPuddles(geoJson);

        setPuddles(nextPuddles);
        setSelectedPuddle((current) => current ?? nextPuddles[0] ?? null);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPuddles();

    return () => controller.abort();
  }, []);

  const statusText = useMemo(() => {
    if (activeTab === 'add') return '水たまりを追加';
    if (activeTab === 'navi') return '安全なルートを確認';
    return '水たまりスポット';
  }, [activeTab]);

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <div>
          <p className={styles.brandSub}>Puddle Safety Map</p>
          <h1>AquaStep</h1>
        </div>
        <div className={styles.weatherPill}>
          <Droplets size={16} />
          <span>雨上がり</span>
        </div>
      </header>

      <section className={styles.mapArea}>
        <PuddleMap
          puddles={puddles}
          selectedPuddle={selectedPuddle}
          onSelectPuddle={(puddle) => {
            setSelectedPuddle(puddle);
            setActiveTab('spot');
          }}
        />

        <div className={styles.floatingStatus}>
          <strong>{statusText}</strong>
          <span>{isLoading ? 'loading...' : `${puddles.length} spots nearby`}</span>
        </div>
      </section>

      {activeTab === 'add' ? (
        <AddPuddlePanel onClose={() => setActiveTab('spot')} />
      ) : (
        <PuddleDetailSheet puddle={selectedPuddle} mode={activeTab} />
      )}

      <nav className={styles.bottomNav}>
        <button
          className={activeTab === 'spot' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('spot')}
        >
          <MapPin size={20} />
          <span>SPOT</span>
        </button>
        <button
          className={activeTab === 'navi' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('navi')}
        >
          <Navigation size={20} />
          <span>NAVI</span>
        </button>
        <button
          className={activeTab === 'add' ? styles.activeNavButton : styles.navButton}
          onClick={() => setActiveTab('add')}
        >
          <Plus size={20} />
          <span>ADD</span>
        </button>
      </nav>
    </main>
  );
}
