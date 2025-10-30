import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User} from '../../../models/user.model';
import { Permission } from '../../../models/permission.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {
  public Permission = Permission;
  users$: Observable<User[]>;
  displayedColumns: string[] = ['name', 'email', 'permissions', 'actions'];

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.users$ = this.userService.getAll();
  }

  ngOnInit(): void {}

  canEditOrDelete(user: User): boolean {
    return this.authService.hasPermission(Permission.UPDATE_USER)
      || this.authService.hasPermission(Permission.DELETE_USER);
  }

  editUser(user: User) {
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteUser(user: User) {
    if (confirm(`Delete user "${user.name} ${user.surname}"?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => this.snackBar.open('User deleted', 'Close', { duration: 2200, panelClass: ['snackbar-success'] }),
        error: () => this.snackBar.open('Failed to delete user', 'Close', { duration: 2200, panelClass: ['snackbar-error'] })
      });
    }
  }

  addUser() {
    this.router.navigate(['/users/add']);
  }

}
