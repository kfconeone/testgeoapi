import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export interface User {
  nickname: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  currentUser?: User;

  userDatas: User[] = [
    {
      nickname: 'admin',
      username: 'admin',
      email: '',
      password: 'admin',
    },
  ];

  public login(username: string, password: string) {
    const user = this.userDatas.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }
}

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userManagementService = inject(UserManagementService);
  if (userManagementService.currentUser) {
    return true;
  }

  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};
