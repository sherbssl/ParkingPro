export interface EvChargerInfo {
  count: number;
  powerKw: number;
  type: string;
  available: number;
}

export interface TariffStructure {
  peakDayRate: string;
  offPeakRate: string;
  eveningRate: string;
  weekendRate: string;
  gracePeriodMins: number;
  heightLimitM: number;
  ratePerHalfHourDay: number;
  ratePerHalfHourEvening: number;
  firstHourRate?: number;
  subsequentHalfHourRate?: number;
}

export interface ParkingFacility {
  id: string;
  name: string;
  address: string;
  subTitle: string;
  type: 'building' | 'street' | 'ev';
  walkMeters: number;
  walkMinutes: number;
  availableLots: number;
  totalLots: number;
  status: 'available' | 'filling_fast' | 'limited' | 'full';
  imageUrl?: string;
  isIndoor: boolean;
  heightLimit?: string;
  evChargers?: EvChargerInfo;
  hasCctv: boolean;
  hasValet: boolean;
  freeAfterTime?: string;
  tariff: TariffStructure;
  mapPinId: string;
  coords: { x: number; y: number }; // SVG map coordinates (0-1000, 0-700)
  isCheapest?: boolean;
  isPopular?: boolean;
  features: string[];
  // Pro attributes
  forecastProbability?: number; // 0-100% confidence
  erpGantryToll?: number; // SGD dollars
  erpGantryName?: string;
}

export type SortCategory = 'distance' | 'price' | 'lots' | 'forecast';
export type ViewMode = 'split' | 'map' | 'list';
export type MapLayerMode = 'vector' | 'satellite' | 'traffic';
export type FilterCategory = 'all' | 'building' | 'street' | 'ev';
export type RadiusOption = '500m' | '1.0 km' | '1.5 km' | '2.0 km';
export type CostDisplayMode = 'total' | 'hourly';
export type ActiveTab = 'live-map' | 'calculator' | 'saved' | 'ev' | 'season';

export interface ProReservation {
  id: string;
  facility: ParkingFacility;
  bayNumber: string;
  vehiclePlate: string;
  expiresInMins: number;
  bookingTime: string;
}


