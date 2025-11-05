import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly LS_USER_KEY = 'currentUser';
  private userSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.userSubject.asObservable();

  // Mock database of users
  private mockUsers: Array<{email: string, password: string, user: User}> = [
    {
      email: 'admin@raf.rs',
      password: 'admin123',
      user: {
        id: 1,
        name: 'Admin',
        surname: 'User',
        email: 'admin@raf.rs',
        permissions: Object.values(Permission) // sve permissions
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

  constructor() {
    // On service init (app startup), restore user from localStorage
    this.restoreUserFromStorage();
  }

  private restoreUserFromStorage(): void {
    const stored = localStorage.getItem(this.LS_USER_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.userSubject.next(user);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem(this.LS_USER_KEY);
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulanje delaya
    return new Observable(observer => {
      setTimeout(() => {
        const found = this.mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (found) {
          // Save user to localStorage
          localStorage.setItem(this.LS_USER_KEY, JSON.stringify(found.user));
          this.userSubject.next(found.user);
          observer.next(true);
        } else {
          this.userSubject.next(null);
          observer.next(false);
        }
        observer.complete();
      }, 500); // 500ms delay
    });
  }

  logout(): void {
    localStorage.removeItem(this.LS_USER_KEY);
    this.userSubject.next(null);

  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  getCurrentUser(): User | null {
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
