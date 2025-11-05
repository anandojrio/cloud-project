
export interface ErrorLog {
  id: number;
  machineId: number;
  message: string;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}
