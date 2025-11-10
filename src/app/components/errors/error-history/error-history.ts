import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MachineService } from '../../../services/machine.service';

@Component({
  selector: 'app-error-history',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './error-history.html',
  styleUrls: ['./error-history.css']
})
export class ErrorHistoryComponent implements OnInit {
  errors: any[] = [];
  displayedColumns = ['timestamp', 'machineName', 'operation', 'statusAtError', 'message'];

  constructor(private machineService: MachineService) {}

  ngOnInit() {
    this.machineService.getAllErrors().subscribe(data => {
      this.errors = data;
    });
  }
}
