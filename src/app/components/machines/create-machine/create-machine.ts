import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MachineService } from '../../../services/machine.service';
import { MachineStatus } from '../../../models/machine.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.html',
  styleUrls: ['./create-machine.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class CreateMachineComponent {
  machineForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private machineService: MachineService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.machineForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.machineForm.invalid) {
      this.snackBar.open('Name is required and must be at least 3 characters.', 'Close', {
        panelClass: 'snackbar-error',
        duration: 3000
      });
      this.machineForm.markAllAsTouched();
      return;
    }

    const name = this.machineForm.value.name.trim();

    // Check uniqueness
    this.machineService.getAll().subscribe(machines => {
      const exists = machines.some(m => m.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        this.snackBar.open('A machine with this name already exists!', 'Close', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
        return;
      }

      // Create machine
      this.isLoading = true;
      const currentUser = this.authService.currentUser;
      const newMachine = {
        name,
        status: MachineStatus.STOPPED,
        active: true,
        createdBy: currentUser?.email || 'unknown',
        createdDate: new Date()
      };

      this.machineService.create(newMachine).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Machine created successfully!', 'Close', {
            panelClass: 'snackbar-success',
            duration: 2500
          });
          this.router.navigate(['/machines']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Error creating machine.', 'Close', {
            panelClass: 'snackbar-error',
            duration: 3000
          });
        }
      });
    });
  }
}
