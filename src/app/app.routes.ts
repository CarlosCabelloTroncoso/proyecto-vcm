import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Cliente } from './pages/cliente/cliente';
import { Profesor } from './pages/profesor/profesor';
import { Gestor } from './pages/gestor/gestor';
import { Encargado } from './pages/encargado/encargado';
import { Autoridad } from './pages/autoridad/autoridad';

export const routes: Routes = [

  {path: '', component: Home},
  {path: 'registro', component: Registro},
  {path: 'login', component: Login},  
  // ── Cliente ──
  {
    path: 'cliente',
    component: Cliente,
    children: [
      {path: '', redirectTo: 'inicio', pathMatch: 'full'},
      {
        path: 'inicio',
        loadComponent: () => import('./components/roles-contenido/cliente/home-cliente/home-cliente')
          .then(m => m.HomeCliente)
      },
      {
        path: 'mis-solicitudes',
        loadComponent: () => import('./components/roles-contenido/cliente/mis-solicitudes/mis-solicitudes')
          .then(m => m.MisSolicitudes)
      },
      {
        path: 'crear-solicitud',
        loadComponent: () => import('./components/roles-contenido/cliente/crear-solicitud/crear-solicitud')
          .then(m => m.CrearSolicitud)
      },
    ]
  },
  //Profesor
  {
    path: 'profesor', 
    component: Profesor,
    children:[
      {path: '', redirectTo: 'inicio', pathMatch: 'full'},
      {
        path: 'inicio',
        loadComponent: () => import('./components/roles-contenido/profesor/home-profesor/home-profesor')
          .then(m=> m.HomeProfesor)
      },
            {
        path: 'solicitudes',
        loadComponent: () => import('./components/roles-contenido/profesor/solicitudes/solicitudes')
          .then(m=> m.Solicitudes)
      },
      {
        path: 'planteamientos',
        loadComponent: () => import('./components/roles-contenido/profesor/planteamientos/planteamientos')
          .then(m=> m.Planteamientos)
      },
      {
        path: 'proyectos',
        loadComponent: () => import('./components/roles-contenido/profesor/proyectos/proyectos')
          .then(m=> m.Proyectos)
      },
    ]
  },
  //Gestor
  {
    path: 'gestor',
    component: Gestor,
    children:[
      {path: '', redirectTo: 'inicio',pathMatch: 'full'},
      {
          path: 'inicio',
          loadComponent: () => import('./components/roles-contenido/gestor/home-gestor/home-gestor')
            .then(m=> m.HomeGestor)
      },
            {
          path: 'ver-solicitudes',
          loadComponent: () => import('./components/roles-contenido/gestor/ver-solicitudes/ver-solicitudes')
            .then(m=> m.VerSolicitudes)
      },
            {
          path: 'vincular-solicitudes',
          loadComponent: () => import('./components/roles-contenido/gestor/vincular-solicitudes/vincular-solicitudes')
            .then(m=> m.VincularSolicitudes)
      },
    ]
  },
  //Encargado
  {
    path: 'encargado',
    component: Encargado,
    children:[
      {path: '', redirectTo: 'inicio',pathMatch: 'full'},
      {
          path: 'inicio',
          loadComponent: () => import('./components/roles-contenido/encargado/home-encargado/home-encargado')
            .then(m=> m.HomeEncargado)
      },
      {
          path: 'ver-solicitudes',
          loadComponent: () => import('./components/roles-contenido/encargado/ver-solicitudes/ver-solicitudes')
            .then(m=> m.VerSolicitudes)
      },
      {
          path: 'gestion-planteamiento',
          loadComponent: () => import('./components/roles-contenido/encargado/gestion-planteamiento/gestion-planteamiento')
            .then(m=> m.GestionPlanteamiento)
      },
      {
          path: 'gestion-proyecto',
          loadComponent: () => import('./components/roles-contenido/encargado/gestion-proyecto/gestion-proyecto')
            .then(m=> m.GestionProyecto)
      },
      {
          path: 'alumnos',
          loadComponent: () => import('./components/roles-contenido/encargado/alumno/alumno')
            .then(m=> m.Alumno)
      },
      {
          path: 'reportes',
          loadComponent: () => import('./components/roles-contenido/encargado/reportes/reportes')
            .then(m=> m.Reportes)
      },
    ]
  },
  {
  path: 'autoridad',
  component: Autoridad,
  children: [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    {
      path: 'inicio',
      loadComponent: () => import('./components/roles-contenido/autoridad/home-autoridad/home-autoridad')
        .then(m => m.HomeAutoridad)
    },
    {
      path: 'ver-solicitudes',
      loadComponent: () => import('./components/roles-contenido/autoridad/ver-solicitudes/ver-solicitudes')
        .then(m => m.VerSolicitudes)
    },
    {
      path: 'reportes',
      loadComponent: () => import('./components/roles-contenido/autoridad/reportes/reportes')
        .then(m => m.Reportes)
    },
  ]
},
  {path: '**', redirectTo: ''},
]
