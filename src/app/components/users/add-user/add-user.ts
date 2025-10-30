import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Permission } from '../../../models/permission.model';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms'
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIcon
]
})
export class AddUserComponent {
  permissionsList = Object.values(Permission);
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      permissions: this.fb.array([], Validators.required)
    });
  }

  onCheckboxChange(event: any) {
    const perms: FormArray = this.userForm.get('permissions') as FormArray;
    if (event.checked) {
      perms.push(this.fb.control(event.source.value));
    } else {
      const index = perms.controls.findIndex(x => x.value === event.source.value);
      if (index !== -1) perms.removeAt(index);
    }
    perms.markAsTouched();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.snackBar.open('Сва поља морају бити попуњена и бар једна дозвола изабрана.', 'Затвори', {
        panelClass: 'snackbar-error',
        duration: 3000
      });
      this.userForm.markAllAsTouched();
      return;
    }

    const user = {
      ...this.userForm.value,
      permissions: this.userForm.value.permissions
    };

    this.userService.add(user).subscribe({
      next: () => {
        this.snackBar.open('Корисник је успешно додат!', 'Затвори', {
          panelClass: 'snackbar-success',
          duration: 2500
        });
        this.router.navigate(['/users']);
      },
      error: () => {
        this.snackBar.open('Дошло је до грешке приликом додавања корисника.', 'Затвори', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
      }
    });
  }
}
