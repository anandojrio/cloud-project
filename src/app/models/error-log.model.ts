
export interface ErrorLog {
  id: number;
  machineId: number;    // Related machine
  message: string;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}
