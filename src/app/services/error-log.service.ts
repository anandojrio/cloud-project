import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ErrorLog } from '../models/error-log.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {
  private logsSubject = new BehaviorSubject<ErrorLog[]>([
    {
      id: 1,
      machineId: 1,
      message: 'Machine restarted after an error',
      timestamp: new Date(),
      severity: 'INFO'
    }
  ]);

  logs$ = this.logsSubject.asObservable();

  getAll(): Observable<ErrorLog[]> {
    return this.logs$;
  }

  getByMachine(machineId: number): Observable<ErrorLog[]> {
    return of(this.logsSubject.value.filter(log => log.machineId === machineId));
  }

  add(log: ErrorLog): Observable<void> {
    const logs = this.logsSubject.value;
    const nextId = Math.max(...logs.map(l => l.id), 0) + 1;
    log.id = nextId;
    this.logsSubject.next([...logs, log]);
    return of();
  }
}
