'use client';

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import type { Puddle } from '@/types/puddle';

type Props = {
  puddles: Puddle[];
  selectedPuddle: Puddle | null;
  onSelectPuddle: (puddle: Puddle) => void;
};

export default function PuddleMap({ puddles, selectedPuddle, onSelectPuddle }: Props) {
  return (
    <MapContainer center={[33.9681, 134.3491]} zoom={17} zoomControl={false}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {puddles.map((puddle) => {
        const isSelected = selectedPuddle?.id === puddle.id;
        const radius = Math.max(11, Math.min(26, puddle.diameterCm / 7));

        return (
          <CircleMarker
            key={puddle.id}
            center={[puddle.lat, puddle.lng]}
            radius={isSelected ? radius + 4 : radius}
            pathOptions={{
              color: isSelected ? '#0369a1' : '#0284c7',
              fillColor: isSelected ? '#38bdf8' : '#7dd3fc',
              fillOpacity: isSelected ? 0.7 : 0.45,
              weight: isSelected ? 4 : 2
            }}
            eventHandlers={{ click: () => onSelectPuddle(puddle) }}
          >
            <Popup>
              <strong>{puddle.name}</strong>
              <br />
              深さ {puddle.depthCm}cm / 大きさ {puddle.diameterCm}cm
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
