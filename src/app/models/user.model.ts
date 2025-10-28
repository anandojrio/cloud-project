import { Permission } from './permission.model';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  permissions: Permission[];
}
