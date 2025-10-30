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
      'create_user', 'read_user', 'update_user', 'delete_user',
      'search_machines', 'create_machine', 'start_machine',
      'stop_machine', 'restart_machine', 'destroy_machine',
      'read_error_messages'
    ]
  },
  {
    id: 2,
    name: 'Student',
    surname: 'User',
    email: 'student@raf.rs',
    permissions: ['read_user', 'search_machines']
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
    const users = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    return of(users);
  }

  add(user: User): Observable<User> {
    const users = JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    // Assign a new ID (tiny mock)
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

