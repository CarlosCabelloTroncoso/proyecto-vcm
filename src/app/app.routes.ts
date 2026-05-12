import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';

export const routes: Routes = [

  {path: '', component: Home},
  {path: 'registro', component: Registro},
  {path: 'login', component: Login}

];

