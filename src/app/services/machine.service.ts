import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Machine, MachineStatus } from '../models/machine.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private machinesSubject = new BehaviorSubject<Machine[]>([
    {
      id: 1,
      name: 'RAF Cloud VM 1',
      status: 'RUNNING',
      ownerId: 1,
      allowedUserIds: [1, 2],
      createdAt: new Date('2024-01-01')
    }
  ]);
  machines$ = this.machinesSubject.asObservable();

  getAll(): Observable<Machine[]> {
    return this.machines$;
  }

  getById(id: number): Observable<Machine | undefined> {
    return of(this.machinesSubject.value.find(m => m.id === id));
  }

  add(machine: Machine): Observable<void> {
    const machines = this.machinesSubject.value;
    const nextId = Math.max(...machines.map(m => m.id), 0) + 1;
    machine.id = nextId;
    this.machinesSubject.next([...machines, machine]);
    return of();
  }

  update(machine: Machine): Observable<void> {
    let machines = this.machinesSubject.value;
    machines = machines.map(m => m.id === machine.id ? machine : m);
    this.machinesSubject.next(machines);
    return of();
  }

  delete(id: number): Observable<void> {
    const machines = this.machinesSubject.value.filter(m => m.id !== id);
    this.machinesSubject.next(machines);
    return of();
  }

  // You can also simulate actions like start/stop
  setStatus(id: number, status: MachineStatus): Observable<void> {
    const machines = this.machinesSubject.value.map(m =>
      m.id === id ? { ...m, status } : m
    );
    this.machinesSubject.next(machines);
    return of();
  }
}
