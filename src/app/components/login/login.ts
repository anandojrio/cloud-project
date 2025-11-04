import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // inicijalizacija forme
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
  this.loginError = null;
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.loginForm.value;
  this.isLoading = true;

  this.authService.login(email, password).subscribe({
    next: (success) => {
      this.isLoading = false;
      if (success) {
        this.snackBar.open('Welcome! Logged in successfully.', 'Close', {
          duration: 2000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/home']);
      } else {
        this.snackBar.open('Invalid email or password.', 'Close', {
          duration: 3500,
          panelClass: ['snackbar-error']
        });
        this.loginError = 'Invalid email or password. Please try again.';
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.snackBar.open('Login failed. Please try again.', 'Close', {
        duration: 3500,
        panelClass: ['snackbar-error']
      });
      this.loginError = 'An error occurred. Please try again.';
    }
  });
}


  // Helper method to get form control errors
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}
