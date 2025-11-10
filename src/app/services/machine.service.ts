import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Machine, MachineError, MachineStatus } from '../models/machine.model';
import { AuthService } from './auth.service';

const DEFAULT_MACHINES: Machine[] = [
  {
    id: 1,
    name: 'Web Server 01',
    status: MachineStatus.RUNNING,
    active: true,
    createdBy: 'admin@raf.rs',
    createdDate: new Date('2024-10-15'),
    errors: [
      {
        timestamp: new Date('2024-11-08T10:30:00'),
        operation: 'restart',
        message: 'Connection timeout during restart',
        statusAtError: MachineStatus.RUNNING
      },
      {
        timestamp: new Date('2024-11-09T14:22:00'),
        operation: 'stop',
        message: 'Failed to gracefully stop services',
        statusAtError: MachineStatus.RUNNING
      }
    ]
  },
  {
    id: 2,
    name: 'Database Server',
    status: MachineStatus.STOPPED,
    active: true,
    createdBy: 'admin@raf.rs',
    createdDate: new Date('2024-09-20'),
    errors: []
  },
  {
    id: 3,
    name: 'Test Environment',
    status: MachineStatus.RUNNING,
    active: true,
    createdBy: 'student@raf.rs',
    createdDate: new Date('2024-11-01'),
    errors: [
      {
        timestamp: new Date('2024-11-10T09:15:00'),
        operation: 'start',
        message: 'Out of memory error',
        statusAtError: MachineStatus.STOPPED
      },
      {
        timestamp: new Date('2024-11-10T11:45:00'),
        operation: 'restart',
        message: 'Kernel panic during boot sequence',
        statusAtError: MachineStatus.RUNNING
      }
    ]
  }
];


@Injectable({ providedIn: 'root' })
export class MachineService {
  private LS_KEY = 'machines';

  constructor(private authService: AuthService) {
    // Seed localStorage sa demo masinama
    // TEMPORARY: Force re-seed to get machines with errors
  localStorage.removeItem(this.LS_KEY);

  if (!localStorage.getItem(this.LS_KEY)) {
    localStorage.setItem(this.LS_KEY, JSON.stringify(DEFAULT_MACHINES));
  }
  }

  private filterByOwner(machines: Machine[]): Machine[] {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return [];
    if (currentUser.email === 'admin@raf.rs') {
      return machines;
    }
    return machines.filter(m => m.createdBy === currentUser.email);
  }

  getAll(): Observable<Machine[]> {
    const machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    return of(this.filterByOwner(machines).map(m => ({ ...m, createdDate: new Date(m.createdDate) })));
  }

  search(name?: string, statuses?: MachineStatus[], dateFrom?: Date, dateTo?: Date): Observable<Machine[]> {
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    machines = this.filterByOwner(machines).map(m => ({ ...m, createdDate: new Date(m.createdDate) }));

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

  randomDelayMs(): number {
    return Math.floor(Math.random() * 5000) + 10000; // 10000 to 15000 ms
  }

  create(machine: Omit<Machine, 'id'>): Observable<Machine> {
    const machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const newMachine: Machine = { ...machine, id: Date.now() };
    machines.push(newMachine);
    localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
    return of(newMachine).pipe(delay(800));
  }

  start(id: number): Observable<Machine> {
    const delayMs = this.randomDelayMs();
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const machine = machines.find(m => m.id === id);
    if (machine) {
      machine.status = MachineStatus.RUNNING;
      localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
      return of({ ...machine, createdDate: new Date(machine.createdDate) }).pipe(delay(delayMs));
    }
    return of(null as any);
  }

  stop(id: number): Observable<Machine> {
    const delayMs = this.randomDelayMs();
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const machine = machines.find(m => m.id === id);
    if (machine) {
      machine.status = MachineStatus.STOPPED;
      localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
      return of({ ...machine, createdDate: new Date(machine.createdDate) }).pipe(delay(delayMs));
    }
    return of(null as any);
  }

  restart(id: number): Observable<Machine> {
    const delayMs = this.randomDelayMs();
    const halfDelay = Math.floor(delayMs / 2);

    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    const machine = machines.find(m => m.id === id);
    if (!machine) {
      return of(null as any);
    }

    return new Observable<Machine>(observer => {
      const halfTimer = setTimeout(() => {
        machine.status = MachineStatus.STOPPED;
        localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
      }, halfDelay);

      const fullTimer = setTimeout(() => {
        machine.status = MachineStatus.RUNNING;
        localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
        observer.next({ ...machine, createdDate: new Date(machine.createdDate) });
        observer.complete();
        clearTimeout(halfTimer);
      }, delayMs);

      return () => {
        clearTimeout(halfTimer);
        clearTimeout(fullTimer);
      };
    });
  }

  destroy(id: number): Observable<void> {
    const delayMs = this.randomDelayMs();
    let machines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    machines = machines.filter(m => m.id !== id);
    localStorage.setItem(this.LS_KEY, JSON.stringify(machines));
    return of().pipe(delay(delayMs));
  }

  getAllErrors(): Observable<any[]> {
  // Step 1: Load all machines from localStorage
  const allMachines: Machine[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
  console.log('All machines:', allMachines);

  const filteredMachines = this.filterByOwner(allMachines);
  console.log('Filtered machines:', filteredMachines);
  console.log('Current user:', this.authService.currentUser);

  // Step 3: Extract all errors from the filtered machines
  const errors: any[] = [];
  filteredMachines.forEach(machine => {
    if (machine.errors && machine.errors.length > 0) {
      machine.errors.forEach(error => {
        errors.push({
          ...error,
          machineName: machine.name,
          timestamp: new Date(error.timestamp)
        });
      });
    }
  });

  // Step 4: Sort by newest first
  errors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return of(errors);
}

}
