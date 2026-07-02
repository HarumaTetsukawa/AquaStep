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
};
