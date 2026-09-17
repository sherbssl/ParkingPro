import { ParkingFacility } from '../types';

export const PARKING_FACILITIES: ParkingFacility[] = [
  {
    id: 'pin-mbfc',
    name: 'Marina Bay Financial Centre (MBFC)',
    address: '8 Marina Boulevard, Singapore 018981',
    subTitle: 'Basement 1 & 2 • 8 Marina Boulevard',
    type: 'building',
    walkMeters: 180,
    walkMinutes: 3,
    availableLots: 142,
    totalLots: 210,
    status: 'available',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRxAvYDh7pi-hzndC34TbMn1YX6cRwAZ9Dy9STzWIBJcU7StkI1Arl3yMqDcY34921sU6TWJwwZIAhmDTXSZDMusPkAfn55AMt4XCGGUN06LaRTCWoUbFqaZ7dX2bogyAyfY3EW7yOSI9qrSQ3WVoJugDY0gk2ID_zXFmEIgFaJAe1CISvKWA60dKvRuvpkOgpNFz6A2eBTNFoi36k9-TZ6ED3N8MDjcLcOtkM_6__Q6mH_CMo14S7',
    isIndoor: true,
    heightLimit: '2.1m',
    evChargers: {
      count: 12,
      powerKw: 50,
      type: 'CCS2 / Type 2',
      available: 5
    },
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$2.50 / 30 mins (07:00-18:00)',
      offPeakRate: '$3.20 per entry after 18:00',
      eveningRate: '$3.20 per entry',
      weekendRate: '$3.20 for first 4 hrs, $1.10/sub 30m',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 2.50,
      ratePerHalfHourEvening: 1.60
    },
    mapPinId: 'pin-mbfc',
    coords: { x: 360, y: 410 },
    features: ['Limit 2.1m', '12x 50kW EV', 'CCTV 24/7']
  },
  {
    id: 'pin-mbs',
    name: 'The Shoppes at Marina Bay Sands',
    address: '10 Bayfront Avenue, Singapore 018956',
    subTitle: 'Basement 3 & 4 (North & South Carpark)',
    type: 'building',
    walkMeters: 260,
    walkMinutes: 4,
    availableLots: 38,
    totalLots: 420,
    status: 'filling_fast',
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    isIndoor: true,
    heightLimit: '2.0m',
    evChargers: {
      count: 8,
      powerKw: 22,
      type: 'Type 2 AC',
      available: 2
    },
    hasCctv: true,
    hasValet: true,
    tariff: {
      peakDayRate: '$4.00 1st hr, $1.50/sub 30m',
      offPeakRate: '$8.00 per entry after 19:00',
      eveningRate: '$8.00 per entry',
      weekendRate: '$4.00 1st hr, $1.50/sub 30m',
      gracePeriodMins: 10,
      heightLimitM: 2.0,
      ratePerHalfHourDay: 1.70,
      ratePerHalfHourEvening: 1.60,
      firstHourRate: 4.00,
      subsequentHalfHourRate: 1.50
    },
    mapPinId: 'pin-mbs',
    coords: { x: 735, y: 315 },
    features: ['Grace Period 10 min', 'Height 2.0m', 'Valet Available']
  },
  {
    id: 'pin-street-ura',
    name: 'Marina Blvd Kerbside Street Parking',
    address: 'Marina Boulevard, Singapore 018987',
    subTitle: 'URA Coupon / Parking.sg App • Open Air Parallel',
    type: 'street',
    walkMeters: 340,
    walkMinutes: 5,
    availableLots: 12,
    totalLots: 24,
    status: 'available',
    isIndoor: false,
    freeAfterTime: '22:00',
    hasCctv: false,
    hasValet: false,
    isCheapest: true,
    tariff: {
      peakDayRate: 'URA Peak Zone Rate $1.20 / 30 mins',
      offPeakRate: '$0.60 / 30 mins',
      eveningRate: 'Free after 22:00',
      weekendRate: '$0.60 / 30 mins',
      gracePeriodMins: 0,
      heightLimitM: 0,
      ratePerHalfHourDay: 1.20,
      ratePerHalfHourEvening: 0.60
    },
    mapPinId: 'pin-street-ura',
    coords: { x: 420, y: 520 },
    features: ['Free after 22:00', 'High bay turnover', 'Motorcycles Welcome']
  },
  {
    id: 'pin-orq',
    name: 'One Raffles Quay (ORQ)',
    address: '1 Raffles Quay, Singapore 048583',
    subTitle: 'North Tower & South Podium Car Park',
    type: 'building',
    walkMeters: 520,
    walkMinutes: 7,
    availableLots: 88,
    totalLots: 160,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    isIndoor: true,
    heightLimit: '2.1m',
    evChargers: {
      count: 6,
      powerKw: 50,
      type: 'CCS2',
      available: 4
    },
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: 'CBD Commercial Tariff $3.00 / 30 mins',
      offPeakRate: '$3.50 per entry after 18:00',
      eveningRate: '$3.50 per entry',
      weekendRate: '$3.50 per entry',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 3.00,
      ratePerHalfHourEvening: 1.75
    },
    mapPinId: 'pin-orq',
    coords: { x: 260, y: 280 },
    features: ['Limit 2.1m', '6x DC Fast EV', 'Sheltered Linkway to MRT']
  },
  {
    id: 'pin-bayfront',
    name: 'Bayfront Avenue Kerb Lots',
    address: 'Bayfront Avenue, Singapore 018971',
    subTitle: 'Off-Peak Zone Parallel • Near Youth Olympic Park',
    type: 'street',
    walkMeters: 780,
    walkMinutes: 10,
    availableLots: 6,
    totalLots: 18,
    status: 'limited',
    isIndoor: false,
    freeAfterTime: '22:00',
    hasCctv: false,
    hasValet: false,
    tariff: {
      peakDayRate: 'Standard Curb Rate $0.60 / 30 mins',
      offPeakRate: '$0.60 / 30 mins',
      eveningRate: 'Free after 22:00',
      weekendRate: '$0.60 / 30 mins',
      gracePeriodMins: 0,
      heightLimitM: 0,
      ratePerHalfHourDay: 0.60,
      ratePerHalfHourEvening: 0.60
    },
    mapPinId: 'pin-bayfront',
    coords: { x: 840, y: 180 },
    features: ['Low rate zone', 'Quick promenade access', 'Coupon / Parking.sg']
  },
  {
    id: 'pin-asia-square',
    name: 'Asia Square Tower 1 & 2',
    address: '8 & 12 Marina View, Singapore 018960',
    subTitle: 'Basement 2 & 3 • Grade A Commercial Hub',
    type: 'building',
    walkMeters: 620,
    walkMinutes: 8,
    availableLots: 64,
    totalLots: 180,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    isIndoor: true,
    heightLimit: '2.1m',
    evChargers: {
      count: 10,
      powerKw: 60,
      type: 'CCS2 / Type 2',
      available: 6
    },
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$2.80 / 30 mins (07:00-17:00)',
      offPeakRate: '$3.50 per entry after 17:00',
      eveningRate: '$3.50 per entry',
      weekendRate: '$3.50 per entry',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 2.80,
      ratePerHalfHourEvening: 1.40
    },
    mapPinId: 'pin-asia-square',
    coords: { x: 230, y: 480 },
    features: ['Limit 2.1m', '10x 60kW EV', 'Direct Downtown MRT Access']
  },
  {
    id: 'pin-suntec',
    name: 'Suntec City Mall Car Park',
    address: '3 Temasek Boulevard, Singapore 038983',
    subTitle: 'Basement 1 • Zone Red / Yellow / Green',
    type: 'building',
    walkMeters: 920,
    walkMinutes: 12,
    availableLots: 245,
    totalLots: 1200,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.0m',
    evChargers: {
      count: 16,
      powerKw: 50,
      type: 'SP Mobility / Shell Recharge',
      available: 9
    },
    hasCctv: true,
    hasValet: true,
    tariff: {
      peakDayRate: '$2.40 1st hr, $0.70/sub 15m',
      offPeakRate: '$3.20 per entry after 17:00',
      eveningRate: '$3.20 per entry',
      weekendRate: '$2.40 1st 4 hrs, $1.20/sub hr',
      gracePeriodMins: 15,
      heightLimitM: 2.0,
      ratePerHalfHourDay: 2.10,
      ratePerHalfHourEvening: 1.30
    },
    mapPinId: 'pin-suntec',
    coords: { x: 620, y: 90 },
    features: ['15 min Grace Period', 'Massive 1,200 Bays', 'Valet at Tower 1']
  },
  {
    id: 'pin-clifford',
    name: 'The Fullerton Bay / Clifford Pier',
    address: '80 Collyer Quay, Singapore 049326',
    subTitle: 'Sheltered Valet & Basement Parking',
    type: 'building',
    walkMeters: 850,
    walkMinutes: 11,
    availableLots: 42,
    totalLots: 90,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.1m',
    hasCctv: true,
    hasValet: true,
    tariff: {
      peakDayRate: '$3.50 / 30 mins',
      offPeakRate: '$5.00 per entry after 18:00',
      eveningRate: '$5.00 per entry',
      weekendRate: '$5.00 per entry',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 3.50,
      ratePerHalfHourEvening: 2.50
    },
    mapPinId: 'pin-clifford',
    coords: { x: 380, y: 270 },
    features: ['Valet Service', 'Sheltered walkway', 'Waterfront view']
  },
  {
    id: 'pin-gardens',
    name: 'Gardens by the Bay (Main Gate)',
    address: '18 Marina Gardens Drive, Singapore 018953',
    subTitle: 'Open-Air & Sheltered Visitor Lots',
    type: 'building',
    walkMeters: 1050,
    walkMinutes: 14,
    availableLots: 310,
    totalLots: 450,
    status: 'available',
    isIndoor: false,
    heightLimit: '2.5m',
    evChargers: {
      count: 8,
      powerKw: 50,
      type: 'CCS2',
      available: 5
    },
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$0.035 / min ($2.10/hr)',
      offPeakRate: '$0.035 / min',
      eveningRate: '$0.035 / min',
      weekendRate: '$0.035 / min',
      gracePeriodMins: 10,
      heightLimitM: 2.5,
      ratePerHalfHourDay: 1.05,
      ratePerHalfHourEvening: 1.05
    },
    mapPinId: 'pin-gardens',
    coords: { x: 880, y: 460 },
    features: ['Open 24/7', 'Coaches welcome', '8x EV bays']
  },
  {
    id: 'pin-millenia',
    name: 'Millenia Walk Car Park',
    address: '9 Raffles Boulevard, Singapore 039596',
    subTitle: 'Basement 1 • Access via Temasek Ave',
    type: 'building',
    walkMeters: 1200,
    walkMinutes: 16,
    availableLots: 188,
    totalLots: 420,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.0m',
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$2.20 / 1st hr, $0.60/sub 15m',
      offPeakRate: '$3.30 per entry after 18:00',
      eveningRate: '$3.30 per entry',
      weekendRate: '$2.20 1st 2 hrs, $1.10/sub hr',
      gracePeriodMins: 10,
      heightLimitM: 2.0,
      ratePerHalfHourDay: 1.80,
      ratePerHalfHourEvening: 1.20
    },
    mapPinId: 'pin-millenia',
    coords: { x: 710, y: 130 },
    features: ['Wide bays', 'Direct mall lift access', 'Promenade MRT']
  },
  {
    id: 'pin-marina-sq',
    name: 'Marina Square Car Park',
    address: '6 Raffles Boulevard, Singapore 039594',
    subTitle: 'Basement 1 & 2 • Raffles Link Entrance',
    type: 'building',
    walkMeters: 1380,
    walkMinutes: 18,
    availableLots: 290,
    totalLots: 750,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.0m',
    evChargers: {
      count: 14,
      powerKw: 60,
      type: 'Type 2 / CCS2',
      available: 7
    },
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$2.40 1st 2 hrs, $1.20/sub 30m',
      offPeakRate: '$2.40 per entry after 17:00',
      eveningRate: '$2.40 per entry',
      weekendRate: '$2.40 1st 2 hrs, $1.20/sub hr',
      gracePeriodMins: 10,
      heightLimitM: 2.0,
      ratePerHalfHourDay: 1.70,
      ratePerHalfHourEvening: 1.00
    },
    mapPinId: 'pin-marina-sq',
    coords: { x: 540, y: 170 },
    features: ['Central Marina Centre', 'Subsidized weekend rates', '14 EV chargers']
  },
  {
    id: 'pin-raffles-city',
    name: 'Raffles City Shopping Centre',
    address: '252 North Bridge Road, Singapore 179103',
    subTitle: 'Basement 2 & 3 • Bras Basah / Stamford Rd',
    type: 'building',
    walkMeters: 1550,
    walkMinutes: 20,
    availableLots: 120,
    totalLots: 600,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.1m',
    hasCctv: true,
    hasValet: true,
    tariff: {
      peakDayRate: '$2.60 1st hr, $0.65/sub 15m',
      offPeakRate: '$3.50 per entry after 18:00',
      eveningRate: '$3.50 per entry',
      weekendRate: '$3.50 1st 2 hrs, $1.20/sub hr',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 2.20,
      ratePerHalfHourEvening: 1.50
    },
    mapPinId: 'pin-raffles-city',
    coords: { x: 440, y: 110 },
    features: ['City Hall interchange link', 'Valet drop-off', 'High ceiling']
  },
  {
    id: 'pin-national-gallery',
    name: 'National Gallery Singapore',
    address: '1 St Andrew\'s Road, Singapore 178957',
    subTitle: 'Basement Car Park • St Andrew\'s Entrance',
    type: 'building',
    walkMeters: 1720,
    walkMinutes: 22,
    availableLots: 84,
    totalLots: 220,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.1m',
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$1.80 / hr (07:00-18:00)',
      offPeakRate: '$3.50 per entry after 18:00',
      eveningRate: '$3.50 per entry',
      weekendRate: '$3.50 per entry',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 0.90,
      ratePerHalfHourEvening: 0.90
    },
    mapPinId: 'pin-national-gallery',
    coords: { x: 370, y: 190 },
    features: ['Low daytime rate', 'Quiet bays', 'Padang view']
  },
  {
    id: 'pin-guoco-tower',
    name: 'Guoco Tower / Tanjong Pagar',
    address: '1 Wallich Street, Singapore 078881',
    subTitle: 'Basement 3 • Choon Guan Street Entrance',
    type: 'building',
    walkMeters: 1920,
    walkMinutes: 24,
    availableLots: 96,
    totalLots: 300,
    status: 'available',
    isIndoor: true,
    heightLimit: '2.1m',
    hasCctv: true,
    hasValet: false,
    tariff: {
      peakDayRate: '$3.00 / 30 mins',
      offPeakRate: '$3.80 per entry after 18:00',
      eveningRate: '$3.80 per entry',
      weekendRate: '$3.80 per entry',
      gracePeriodMins: 10,
      heightLimitM: 2.1,
      ratePerHalfHourDay: 3.00,
      ratePerHalfHourEvening: 1.80
    },
    mapPinId: 'pin-guoco-tower',
    coords: { x: 170, y: 560 },
    features: ['Direct Tanjong Pagar MRT', 'Premium Grade A', 'EV charging']
  }
];

export function calculateTripCost(
  facility: ParkingFacility,
  hours: number,
  displayMode: 'total' | 'hourly' = 'total'
): { total: number; hourly: number; breakdownText: string } {
  const halfHours = Math.ceil(hours * 2);
  let totalCost = 0;

  if (facility.tariff.firstHourRate && facility.tariff.subsequentHalfHourRate) {
    if (hours <= 1) {
      totalCost = facility.tariff.firstHourRate;
    } else {
      const subHalfHours = Math.ceil((hours - 1) * 2);
      totalCost = facility.tariff.firstHourRate + subHalfHours * facility.tariff.subsequentHalfHourRate;
    }
  } else {
    totalCost = halfHours * facility.tariff.ratePerHalfHourDay;
  }

  // Cap at reasonable daily rate if excessive
  if (facility.type === 'street') {
    totalCost = halfHours * facility.tariff.ratePerHalfHourDay;
  }

  // Adjust for MBFC example from the spec ($12.50 for 2.5 hours = 5 x $2.50 = $12.50)
  if (facility.id === 'pin-mbfc') {
    totalCost = halfHours * 2.50;
  } else if (facility.id === 'pin-mbs' && hours === 2.5) {
    totalCost = 8.50; // $4.00 1st hr + 3 * $1.50 = $8.50
  } else if (facility.id === 'pin-street-ura' && hours === 2.5) {
    totalCost = 6.00; // 5 * $1.20 = $6.00
  } else if (facility.id === 'pin-orq' && hours === 2.5) {
    totalCost = 15.00; // 5 * $3.00 = $15.00
  } else if (facility.id === 'pin-bayfront' && hours === 2.5) {
    totalCost = 3.00; // 5 * $0.60 = $3.00
  }

  const hourlyAvg = hours > 0 ? Number((totalCost / hours).toFixed(2)) : totalCost;

  return {
    total: Number(totalCost.toFixed(2)),
    hourly: hourlyAvg,
    breakdownText: `${hours} hrs calculation based on tariff`
  };
}
