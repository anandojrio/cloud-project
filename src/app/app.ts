import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink, Event, NavigationCancel } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'RAF Cloud';
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationCancel) {
        this.snackBar.open('You do not have permission to access this page.', 'Close', {
          duration: 3500,
          panelClass: 'snackbar-error'
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('Successfully logged out!', 'Close', {
      duration: 2500,
      panelClass: 'snackbar-success'
    });
    this.router.navigate(['/login']);
  }
}
