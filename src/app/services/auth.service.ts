import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.userSubject.asObservable();

  // Mock baza podataka usera
  private mockUsers: Array<{email: string, password: string, user: User}> = [
    {
      email: 'admin@raf.rs',
      password: 'admin123',
      user: {
        id: 1,
        name: 'Admin',
        surname: 'User',
        email: 'admin@raf.rs',
        permissions: Object.values(Permission) // All permissions
      }
    },
    {
      email: 'student@raf.rs',
      password: 'student123',
      user: {
        id: 2,
        name: 'Student',
        surname: 'User',
        email: 'student@raf.rs',
        permissions: [Permission.READ_USER, Permission.SEARCH_MACHINES]
      }
    }
  ];

  constructor() {}

  // Login with email and password
  login(email: string, password: string): Observable<boolean> {
    // Simulate network delay
    return new Observable(observer => {
      setTimeout(() => {
        const found = this.mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (found) {
          this.userSubject.next(found.user);
          observer.next(true);
        } else {
          this.userSubject.next(null);
          observer.next(false);
        }
        observer.complete();
      }, 500); // simulate 500ms delay
    });
  }

  logout(): void {
    this.userSubject.next(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUser;
    return !!user && user.permissions.includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }
}
