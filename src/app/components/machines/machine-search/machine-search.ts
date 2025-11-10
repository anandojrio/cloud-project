import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MachineService } from '../../../services/machine.service';
import { AuthService } from '../../../services/auth.service';
import { Machine, MachineStatus } from '../../../models/machine.model';
import { Permission } from '../../../models/permission.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScheduleDialogComponent } from '../schedule-action/schedule-action';

@Component({
  selector: 'app-machine-search',
  templateUrl: './machine-search.html',
  styleUrls: ['./machine-search.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class MachineSearchComponent implements OnInit {
  searchForm: FormGroup;
  dataSource = new MatTableDataSource<Machine>([]);
  displayedColumns = ['name', 'status', 'active', 'createdDate', 'createdBy', 'actions'];
  statusOptions = Object.values(MachineStatus);
  searching = false;
  criteriaUsed = false;
  loadingMachines = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private machineService: MachineService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      statuses: [[]],
      from: [null],
      to: [null]
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.machineService.getAll().subscribe(machines => {
      this.dataSource.data = machines;
      this.criteriaUsed = false;
    });
  }

  onSearch() {
    this.searching = true;
    const { name, statuses, from, to } = this.searchForm.value;
    this.machineService.search(
      name?.trim(),
      statuses,
      from,
      to
    ).subscribe(machines => {
      this.dataSource.data = machines;
      this.criteriaUsed = !!(name || (statuses && statuses.length) || from || to);
      this.searching = false;
    });
  }

  clear() {
    this.searchForm.reset({ name: '', statuses: [], from: null, to: null });
    this.loadAll();
  }

  goToCreate() {
    this.router.navigate(['/machines/create']);
  }

  isLoading(machineId: number): boolean {
    return this.loadingMachines.has(machineId);
  }

  canStart(machine: Machine): boolean {
    return machine.status === MachineStatus.STOPPED &&
           this.authService.hasPermission(Permission.START_MACHINE);
  }

  canStop(machine: Machine): boolean {
    return machine.status === MachineStatus.RUNNING &&
           this.authService.hasPermission(Permission.STOP_MACHINE);
  }

  canRestart(machine: Machine): boolean {
    return machine.status === MachineStatus.RUNNING &&
           this.authService.hasPermission(Permission.RESTART_MACHINE);
  }

  canDestroy(): boolean {
    return this.authService.hasPermission(Permission.DESTROY_MACHINE);
  }

  startMachine(machine: Machine) {
    this.loadingMachines.add(machine.id);
    this.machineService.start(machine.id).subscribe({
      next: (updated) => {
        this.loadingMachines.delete(machine.id);
        this.updateMachineInTable(updated);
        this.snackBar.open(`Machine "${machine.name}" started!`, 'Close', {
          panelClass: 'snackbar-success',
          duration: 2500
        });
      },
      error: () => {
        this.loadingMachines.delete(machine.id);
        this.snackBar.open('Failed to start machine.', 'Close', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
      }
    });
  }

  stopMachine(machine: Machine) {
    this.loadingMachines.add(machine.id);
    this.machineService.stop(machine.id).subscribe({
      next: (updated) => {
        this.loadingMachines.delete(machine.id);
        this.updateMachineInTable(updated);
        this.snackBar.open(`Machine "${machine.name}" stopped!`, 'Close', {
          panelClass: 'snackbar-success',
          duration: 2500
        });
      },
      error: () => {
        this.loadingMachines.delete(machine.id);
        this.snackBar.open('Failed to stop machine.', 'Close', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
      }
    });
  }

  restartMachine(machine: Machine) {
    this.loadingMachines.add(machine.id);
    this.machineService.restart(machine.id).subscribe({
      next: (updated) => {
        this.loadingMachines.delete(machine.id);
        this.updateMachineInTable(updated);
        this.snackBar.open(`Machine "${machine.name}" restarted!`, 'Close', {
          panelClass: 'snackbar-success',
          duration: 2500
        });
      },
      error: () => {
        this.loadingMachines.delete(machine.id);
        this.snackBar.open('Failed to restart machine.', 'Close', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
      }
    });
  }

  destroyMachine(machine: Machine) {
    const confirmed = confirm(`Are you sure you want to destroy machine "${machine.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    this.loadingMachines.add(machine.id);
    this.machineService.destroy(machine.id).subscribe({
      next: () => {
        this.loadingMachines.delete(machine.id);
        this.dataSource.data = this.dataSource.data.filter(m => m.id !== machine.id);
        this.snackBar.open(`Machine "${machine.name}" destroyed!`, 'Close', {
          panelClass: 'snackbar-success',
          duration: 2500
        });
      },
      error: () => {
        this.loadingMachines.delete(machine.id);
        this.snackBar.open('Failed to destroy machine.', 'Close', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
      }
    });
  }

  private updateMachineInTable(updatedMachine: Machine) {
    const data = this.dataSource.data;
    const index = data.findIndex(m => m.id === updatedMachine.id);
    if (index !== -1) {
      data[index] = updatedMachine;
      this.dataSource.data = [...data];
    }
  }

  canSchedule(machine: Machine): boolean {
  // Show schedule button only if user can do at least one action on this machine
  return this.canStart(machine) || this.canStop(machine) || this.canRestart(machine) || this.canDestroy();
}


  openScheduleDialog(machine: Machine): void {
  const dialogRef = this.dialog.open(ScheduleDialogComponent, {
    width: '400px',
    data: { machine }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Handle the scheduled action
      console.log('Scheduled:', result);
      this.snackBar.open(
        `${result.action.toUpperCase()} scheduled for ${machine.name} on ${result.date.toLocaleDateString()} at ${result.time}`,
        'Close',
        { duration: 3500, panelClass: 'snackbar-success' }
      );

      // TODO: Save schedule to service/localStorage if needed
    }
  });
}
}
