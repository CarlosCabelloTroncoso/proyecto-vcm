import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Cliente } from './pages/cliente/cliente';
import { Profesor } from './pages/profesor/profesor';
import { Gestor } from './pages/gestor/gestor';
import { Encargado } from './pages/encargado/encargado';

export const routes: Routes = [

  {path: '', component: Home},
  {path: 'registro', component: Registro},
  {path: 'login', component: Login},
  {path: 'cliente', component: Cliente},
  {path: 'profesor', component: Profesor},
  {path: 'gestor', component: Gestor},
  {path: 'encargado', component: Encargado},
  
];

