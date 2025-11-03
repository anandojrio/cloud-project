import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { Permission } from '../../../models/permission.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIcon
  ]
})
export class EditUserComponent implements OnInit {
  permissionsList = Object.values(Permission);
  userForm: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      permissions: this.fb.array([], Validators.required)
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? +idParam : 0;

    this.userService.getById(this.userId).subscribe((user: User | undefined) => {
      if (!user) {
        this.snackBar.open('Корисник није пронађен!', 'Затвори', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
        this.router.navigate(['/users']);
        return;
      }
      // Patch fields (name, surname, email)
      this.userForm.patchValue({
        name: user.name,
        surname: user.surname,
        email: user.email
      });
      // Patch permissions - checkboxes
      const permsFormArray = this.userForm.get('permissions') as FormArray;
      user.permissions.forEach((perm: Permission) => {
        permsFormArray.push(this.fb.control(perm));
      });
      permsFormArray.markAsTouched();
    });
  }

  isPermissionChecked(perm: string): boolean {
    const perms: FormArray = this.userForm.get('permissions') as FormArray;
    return perms.value.includes(perm);
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

    const updatedUser: User = {
      id: this.userId,
      ...this.userForm.value
    };

    this.userService.update(updatedUser).subscribe({
      next: () => {
        this.snackBar.open('Корисник је ажуриран!', 'Затвори', {
          panelClass: 'snackbar-success',
          duration: 2500
        });
        this.router.navigate(['/users']);
      },
      error: () => {
        this.snackBar.open('Дошло је до грешке при чувању.', 'Затвори', {
          panelClass: 'snackbar-error',
          duration: 3000
        });
      }
    });
  }
}
