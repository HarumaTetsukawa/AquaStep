export type RiskLevel = 'low' | 'medium' | 'high';

export type Puddle = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  diameterCm: number;
  depthCm: number;
  slipRisk: RiskLevel;
  fallRisk: RiskLevel;
  nightRisk: RiskLevel;
  updatedAt: string;
  note: string;
  imageUrl?: string | null;
};

export type PuddleRow = {
  id: number;
  longitude: number | string;
  latitude: number | string;
  range_ns_m: number | string;
  range_ew_m: number | string;
  depth_cm: number | string;
  observed_on: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  image_path?: string | null;
  photo_url?: string | null;
  photo_path?: string | null;
  storage_path?: string | null;
  puddle_image_url?: string | null;
};

export type PuddleGeoJsonProperties = {
  id: number;
  range_ns: number;
  range_ew: number;
  depth: number;
  date: string;
  imageUrl: string | null;
};

export type PuddleGeoJsonFeature = {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: PuddleGeoJsonProperties;
};

export type PuddleFeatureCollection = {
  type: 'FeatureCollection';
  features: PuddleGeoJsonFeature[];
};
