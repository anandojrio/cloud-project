import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Machine, MachineStatus } from '../models/machine.model';

const DEFAULT_MACHINES: Machine[] = [
  {
    id: 1,
    name: 'Web Server 01',
    status: MachineStatus.RUNNING,
    active: true,
    createdBy: 'admin@raf.rs',
    createdDate: new Date('2024-10-15')
  },
  {
    id: 2,
    name: 'Database Server',
    status: MachineStatus.STOPPED,
    active: true,
    createdBy: 'admin@raf.rs',
    createdDate: new Date('2024-09-20')
  },
  {
    id: 3,
    name: 'Test Environment',
    status: MachineStatus.RUNNING,
    active: true,
    createdBy: 'student@raf.rs',
    createdDate: new Date('2024-11-01')
  }
];

@Injectable({ providedIn: 'root' })
export class MachineService {
  private LS_KEY = 'machines';

  constructor() {
    // Seed localStorage with demo machines if empty
    if (!localStorage.getItem(this.LS_KEY)) {
      localStorage.setItem(this.LS_KEY, JSON.stringify(DEFAULT_MACHINES));
    }
  }

  getAll(): Observable<Machine[]> {
    const machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    // Convert date strings back to Date objects
    return of(machines.map(m => ({ ...m, createdDate: new Date(m.createdDate) })));
  }

  search(name?: string, statuses?: MachineStatus[], dateFrom?: Date, dateTo?: Date): Observable<Machine[]> {
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    machines = machines.map(m => ({ ...m, createdDate: new Date(m.createdDate) }));

    if (name) {
      machines = machines.filter(m => m.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (statuses && statuses.length > 0) {
      machines = machines.filter(m => statuses.includes(m.status));
    }
    if (dateFrom) {
      machines = machines.filter(m => new Date(m.createdDate) >= dateFrom);
    }
    if (dateTo) {
      machines = machines.filter(m => new Date(m.createdDate) <= dateTo);
    }

    return of(machines);
  }

  create(machine: Omit<Machine, 'id'>): Observable<Machine> {
    const machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const newMachine: Machine = { ...machine, id: Date.now() };
    machines.push(newMachine);
    localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
    return of(newMachine).pipe(delay(800)); // simulate async
  }

  start(id: number): Observable<Machine> {
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const machine = machines.find(m => m.id === id);
    if (machine) {
      machine.status = MachineStatus.RUNNING;
      localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
      return of(machine).pipe(delay(1000));
    }
    return of(null as any);
  }

  stop(id: number): Observable<Machine> {
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const machine = machines.find(m => m.id === id);
    if (machine) {
      machine.status = MachineStatus.STOPPED;
      localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
      return of(machine).pipe(delay(1000));
    }
    return of(null as any);
  }

  restart(id: number): Observable<Machine> {
    // Restart keeps it RUNNING but simulates reset
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const machine = machines.find(m => m.id === id);
    if (machine) {
      machine.status = MachineStatus.RUNNING;
      localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
      return of(machine).pipe(delay(1200));
    }
    return of(null as any);
  }

  destroy(id: number): Observable<void> {
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    machines = machines.filter(m => m.id !== id);
    localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
    return of().pipe(delay(1000));
  }
}
