import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { CreateMachineComponent } from './components/machines/create-machine/create-machine';
import { MachineSearchComponent } from './components/machines/machine-search/machine-search';
import { NavigationComponent } from './components/navigation/navigation';
import { AddUserComponent } from './components/users/add-user/add-user';
import { UserListComponent } from './components/users/user-list/user-list';
import { EditUserComponent } from './components/users/edit-user/edit-user';
import { ErrorHistoryComponent } from './components/errors/error-history/error-history';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'users', component: UserListComponent },
  { path: 'users/add', component: AddUserComponent },
  { path: 'users/edit/:id', component: EditUserComponent },

  { path: 'machines/search', component: MachineSearchComponent },
  { path: 'machines/create', component: CreateMachineComponent },

  { path: 'errors', component: ErrorHistoryComponent },

  // redirect na login
  { path: '**', redirectTo: '/login' }
];
