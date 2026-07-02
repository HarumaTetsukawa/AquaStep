import type { Puddle } from '@/types/puddle';

export const mockPuddles: Puddle[] = [
  {
    id: 'puddle-1',
    name: '体育館前の水たまり',
    lat: 33.96812,
    lng: 134.34876,
    diameterCm: 120,
    depthCm: 4,
    slipRisk: 'medium',
    fallRisk: 'low',
    nightRisk: 'medium',
    updatedAt: '2026-07-01 11:28',
    note: '雨のあとに広がりやすい。端の方は浅い。'
  },
  {
    id: 'puddle-2',
    name: '校門横の浅い水たまり',
    lat: 33.96752,
    lng: 134.3495,
    diameterCm: 70,
    depthCm: 1.5,
    slipRisk: 'low',
    fallRisk: 'low',
    nightRisk: 'low',
    updatedAt: '2026-07-01 11:35',
    note: '靴底が少し濡れる程度。'
  },
  {
    id: 'puddle-3',
    name: '駐輪場前の深い水たまり',
    lat: 33.9687,
    lng: 134.34922,
    diameterCm: 160,
    depthCm: 8,
    slipRisk: 'high',
    fallRisk: 'medium',
    nightRisk: 'high',
    updatedAt: '2026-07-01 11:42',
    note: '暗い時間帯は見えづらく、避けた方がよい。'
  }
];
