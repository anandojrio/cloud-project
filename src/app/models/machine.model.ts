
export type MachineStatus = 'RUNNING' | 'STOPPED' | 'PAUSED' | 'ERROR';

export interface Machine {
  id: number;
  name: string;
  status: MachineStatus;
  ownerId: number;      // user.id od vlasnika
  allowedUserIds: number[];  // ids od usera koji mogu da vide ili kontrolisu
  createdAt: Date;
}
