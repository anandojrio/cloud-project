import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Machine } from '../../../models/machine.model';

@Component({
  selector: 'app-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Schedule Machine Action</h2>
    <mat-dialog-content>
      <form [formGroup]="scheduleForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Machine</mat-label>
          <input matInput [value]="data.machine.name" disabled>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Action</mat-label>
          <mat-select formControlName="action" required>
            <mat-option value="start">Start</mat-option>
            <mat-option value="stop">Stop</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Time</mat-label>
          <input matInput type="time" formControlName="time" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSchedule()" [disabled]="scheduleForm.invalid">
        Schedule
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class ScheduleDialogComponent {
  scheduleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { machine: Machine }
  ) {
    this.scheduleForm = this.fb.group({
      action: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSchedule(): void {
    if (this.scheduleForm.valid) {
      const result = {
        machineId: this.data.machine.id,
        machineName: this.data.machine.name,
        ...this.scheduleForm.value
      };
      this.dialogRef.close(result);
    }
  }
}
