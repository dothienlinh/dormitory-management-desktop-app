export interface MaintenanceHistory {
  id: number;
  description: string;
  room_id: number;
  maintenance_date: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMaintenanceHistories {
  room_id: number;
  maintenance_date: string;
  description: string;
  cost: number;
}
