import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { CreateMachineComponent } from './components/machines/create-machine/create-machine';
import { MachineSearchComponent } from './components/machines/machine-search/machine-search';
import { AddUserComponent } from './components/users/add-user/add-user';
import { UserListComponent } from './components/users/user-list/user-list';
import { EditUserComponent } from './components/users/edit-user/edit-user';
import { ErrorHistoryComponent } from './components/errors/error-history/error-history';
import { HomePageComponent } from './components/homepage/homepage';

import { AuthGuard } from './services/auth.guard';
import { PermissionGuard } from './services/permission.guard';
import { Permission } from './models/permission.model';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },

  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: Permission.READ_USER } },
  { path: 'users/add', component: AddUserComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: Permission.CREATE_USER } },
  { path: 'users/edit/:id', component: EditUserComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: Permission.UPDATE_USER } },

  { path: 'machines/search', component: MachineSearchComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: Permission.SEARCH_MACHINES } },
  { path: 'machines/create', component: CreateMachineComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: Permission.CREATE_MACHINE } },

  { path: 'errors', component: ErrorHistoryComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: Permission.READ_ERROR_MESSAGES } },

  { path: '**', redirectTo: '/home' }
];
