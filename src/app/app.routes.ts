import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { canActivate } from './user-management.service';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [canActivate],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
