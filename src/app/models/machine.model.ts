import { Permission } from './permission.model';

export enum MachineStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED'
}

export interface Machine {
  id: number;
  name: string;
  status: MachineStatus;
  active: boolean;
  createdBy: string;
  createdDate: Date;
}
