import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';

const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Admin',
    surname: 'User',
    email: 'admin@raf.rs',
    permissions: [
      Permission.CREATE_USER,
      Permission.READ_USER,
      Permission.UPDATE_USER,
      Permission.DELETE_USER,
      Permission.SEARCH_MACHINES,
      Permission.CREATE_MACHINE,
      Permission.START_MACHINE,
      Permission.STOP_MACHINE,
      Permission.RESTART_MACHINE,
      Permission.DESTROY_MACHINE,
      Permission.READ_ERROR_MESSAGES
    ]
  },
  {
    id: 2,
    name: 'Student',
    surname: 'User',
    email: 'student@raf.rs',
    permissions: [
      Permission.READ_USER,
      Permission.SEARCH_MACHINES
    ]
  }
];


// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private LS_KEY = 'users';

  constructor() {
    // Only seed if localStorage is empty
    if (!localStorage.getItem(this.LS_KEY)) {
      localStorage.setItem(this.LS_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }

  getAll(): Observable<User[]> {
  const users: User[] = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
  // Remove any accidental duplicate admin/student (by email!)
  const filtered = users.filter(
    u => u.email !== 'admin@raf.rs' && u.email !== 'student@raf.rs'
  );
  // Always return admin and student first
  return of([...DEFAULT_USERS, ...filtered]);
}


  add(user: User): Observable<User> {
  if (
    user.email === 'admin@raf.rs' ||
    user.email === 'student@raf.rs'
  ) {
    // Optionally throw or return error observable
    return of(null as any);
  }
  const users = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
  user.id = Date.now();
  users.push(user);
  localStorage.setItem(this.LS_KEY, JSON.stringify(users));
  return of(user);
}


  getById(id: number): Observable<User | undefined> {
    const users = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    return of(users.find((u: { id: number; }) => u.id === id));
  }

  update(updatedUser: User): Observable<User> {
    let users = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    users = users.map((u: User) => (u.id === updatedUser.id ? updatedUser : u));
    localStorage.setItem(this.LS_KEY, JSON.stringify(users));
    return of(updatedUser);
  }

  delete(id: number): Observable<void> {
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  users = users.filter((u: any) => u.id !== id);
  localStorage.setItem('users', JSON.stringify(users));
  return of();
}

}

