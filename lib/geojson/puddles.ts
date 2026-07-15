import type {
  Puddle,
  PuddleFeatureCollection,
  PuddleGeoJsonFeature,
  PuddleRow,
  RiskLevel
} from '@/types/puddle';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function getRiskLevel(depthCm: number): RiskLevel {
  if (depthCm >= 5) return 'high';
  if (depthCm >= 2) return 'medium';
  return 'low';
}

function formatObservedAt(date: string): string {
  return date.includes(' ') ? date : `${date} 00:00`;
}

function getImageUrl(row: PuddleRow): string | null {
  return (
    row.image_url ??
    row.photo_url ??
    row.puddle_image_url ??
    row.image_path ??
    row.photo_path ??
    row.storage_path ??
    null
  );
}

export function puddleRowsToGeoJson(rows: PuddleRow[]): PuddleFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: rows.map((row) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [toNumber(row.longitude), toNumber(row.latitude)]
      },
      properties: {
        id: row.id,
        range_ns: toNumber(row.range_ns_m),
        range_ew: toNumber(row.range_ew_m),
        depth: toNumber(row.depth_cm),
        date: row.observed_on,
        imageUrl: getImageUrl(row)
      }
    }))
  };
}

export function geoJsonFeatureToPuddle(feature: PuddleGeoJsonFeature): Puddle {
  const [lng, lat] = feature.geometry.coordinates;
  const { id, range_ns, range_ew, depth, date, imageUrl } = feature.properties;
  const diameterCm = Math.round(Math.max(range_ns, range_ew) * 100);
  const risk = getRiskLevel(depth);

  return {
    id: String(id),
    name: `水たまり #${id}`,
    lat,
    lng,
    diameterCm,
    depthCm: depth,
    slipRisk: risk,
    fallRisk: risk,
    nightRisk: risk,
    updatedAt: formatObservedAt(date),
    note: `南北 ${range_ns}m / 東西 ${range_ew}m`,
    imageUrl
  };
}

export function geoJsonToPuddles(geoJson: PuddleFeatureCollection): Puddle[] {
  return geoJson.features.map(geoJsonFeatureToPuddle);
}
