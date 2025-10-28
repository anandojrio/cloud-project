import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // mock admin i obicnog usera
  private usersSubject = new BehaviorSubject<User[]>([
    {
      id: 1,
      name: 'Admin',
      surname: 'User',
      email: 'admin@raf.rs',
      permissions: Object.values(Permission)
    },
    {
      id: 2,
      name: 'Student',
      surname: 'User',
      email: 'student@raf.rs',
      permissions: [Permission.READ_USER, Permission.SEARCH_MACHINES]
    }
  ]);

  users$ = this.usersSubject.asObservable();

  getAll(): Observable<User[]> {
    return this.users$;
  }

  getById(id: number): Observable<User | undefined> {
    return of(this.usersSubject.value.find(u => u.id === id));
  }

  add(user: User): Observable<void> {
    const users = this.usersSubject.value;
    const nextId = Math.max(...users.map(u => u.id), 0) + 1;
    user.id = nextId;
    this.usersSubject.next([...users, user]);
    return of();
  }

  update(user: User): Observable<void> {
    let users = this.usersSubject.value;
    users = users.map(u => u.id === user.id ? user : u);
    this.usersSubject.next(users);
    return of();
  }

  delete(id: number): Observable<void> {
    const users = this.usersSubject.value.filter(u => u.id !== id);
    this.usersSubject.next(users);
    return of();
  }
}
