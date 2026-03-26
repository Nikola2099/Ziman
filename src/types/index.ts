export type AssetStatus =
  | 'operational'
  | 'maintenance'
  | 'fault'
  | 'stopped'
  | 'commissioning';

export const STATUS_LABELS: Record<AssetStatus, string> = {
  operational: 'Operativan',
  maintenance: 'Održavanje',
  fault: 'Kvar',
  stopped: 'Isključen',
  commissioning: 'Puštanje u rad',
};

export interface WTG {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  rated_power: number;   // MW
  hub_height: number;    // m
  rotor_diameter: number; // m
  status: AssetStatus;
  installation_date: string;
  last_maintenance: string;
  next_maintenance: string;
  energy_produced: number; // MWh
  availability: number;    // %
  notes: string;
}

export interface Trafostanica {
  id: string;
  name: string;
  trafo_type: string;
  voltage_high: number; // kV
  voltage_low: number;  // kV
  rated_power: number;  // MVA
  status: AssetStatus;
  installation_date: string;
  last_inspection: string;
  next_inspection: string;
  notes: string;
}

export interface Dalekovod {
  id: string;
  name: string;
  voltage: number;       // kV
  length: number;        // km
  from_point: string;
  to_point: string;
  conductor_type: string;
  status: AssetStatus;
  installation_date: string;
  last_inspection: string;
  notes: string;
}

export interface Kabel {
  id: string;
  name: string;
  voltage: number;       // kV
  cross_section: number; // mm²
  length: number;        // m
  from_point: string;
  to_point: string;
  cable_type: string;
  status: AssetStatus;
  installation_date: string;
  notes: string;
}

export interface AssetStore {
  wtgs: WTG[];
  trafostanice: Trafostanica[];
  dalekovodi: Dalekovod[];
  kablovi: Kabel[];
}
