import { Routes } from '@angular/router';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Cliente } from './pages/cliente/cliente';
import { Profesor } from './pages/profesor/profesor';
import { Encargado } from './pages/encargado/encargado';
import { Autoridad } from './pages/autoridad/autoridad';
import { Admin } from './pages/admin/admin';
import { AuthCallback } from './pages/auth-callback/auth-callback';
import { ReactivarCallback } from './pages/reactivar-callback/reactivar-callback';
import { RecuperarContrasena } from './pages/recuperar-contrasena/recuperar-contrasena';
import { ResetPassword } from './pages/reset-password/reset-password';
import { authGuard, roleGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {path: '', component: Home},
  {path: 'registro', component: Registro, canActivate: [noAuthGuard]},
  {path: 'login', component: Login, canActivate: [noAuthGuard]},
  {path: 'auth/callback', component: AuthCallback},
  {path: 'auth/reactivar', component: ReactivarCallback},
  {path: 'recuperar-contrasena', component: RecuperarContrasena, canActivate: [noAuthGuard]},
  {path: 'auth/reset-password', component: ResetPassword},
  // ── Cliente ──
  {
    path: 'cliente',
    component: Cliente,
    canActivate: [authGuard, roleGuard('cliente')],
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
      {
        path: 'perfil',
        loadComponent: () => import('./components/shared/perfil/perfil')
          .then(m => m.Perfil)
      },
    ]
  },
  // ── Profesor ──
  {
    path: 'profesor',
    component: Profesor,
    canActivate: [authGuard, roleGuard('profesor')],
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
      {
        path: 'proyecto/:id',
        loadComponent: () => import('./components/roles-contenido/profesor/proyecto-detalle/proyecto-detalle')
          .then(m=> m.ProyectoDetalle)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./components/shared/perfil/perfil')
          .then(m => m.Perfil)
      },
    ]
  },
  // ── Encargado (Gestor de Vinculación por Carrera) ──
  {
    path: 'encargado',
    component: Encargado,
    canActivate: [authGuard, roleGuard('encargado')],
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
          path: 'proyecto/:id',
          loadComponent: () => import('./components/roles-contenido/encargado/proyecto-detalle/proyecto-detalle')
            .then(m=> m.ProyectoDetalleEncargado)
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
      {
        path: 'perfil',
        loadComponent: () => import('./components/shared/perfil/perfil')
          .then(m => m.Perfil)
      },
    ]
  },
  // ── Autoridad ──
  {
    path: 'autoridad',
    component: Autoridad,
    canActivate: [authGuard, roleGuard('autoridad')],
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
      {
        path: 'perfil',
        loadComponent: () => import('./components/shared/perfil/perfil')
          .then(m => m.Perfil)
      },
    ]
  },
  // ── Admin ──
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./components/roles-contenido/admin/home-admin/home-admin')
          .then(m => m.HomeAdmin)
      },
      {
        path: 'gestion-facultad',
        loadComponent: () => import('./components/roles-contenido/admin/gestion-facultad/gestion-facultad')
          .then(m => m.GestionFacultad)
      },
      {
        path: 'gestion-carrera',
        loadComponent: () => import('./components/roles-contenido/admin/gestion-carrera/gestion-carrera')
          .then(m => m.GestionCarrera)
      },
      {
        path: 'gestion-usuarios',
        loadComponent: () => import('./components/roles-contenido/admin/gestion-usuario/gestion-usuario')
          .then(m => m.GestionUsuario)
      },
      {
        path: 'gestion-alumno',
        loadComponent: () => import('./components/roles-contenido/admin/gestion-alumno/gestion-alumno')
          .then(m => m.GestionAlumno)
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./components/roles-contenido/admin/solicitudes/solicitudes')
          .then(m => m.Solicitudes)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./components/shared/perfil/perfil')
          .then(m => m.Perfil)
      },
    ]
  },

  {path: '**', redirectTo: ''},
]
