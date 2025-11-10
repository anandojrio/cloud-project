export enum MachineStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED'
}

export interface MachineError {
  timestamp: Date;
  operation: 'start' | 'stop' | 'restart' | 'destroy';
  message: string;
  statusAtError: MachineStatus;
}

export interface Machine {
  id: number;
  name: string;
  status: MachineStatus;
  active: boolean;
  createdBy: string;
  createdDate: Date;
  errors?: MachineError[];
}

