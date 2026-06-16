import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard: requiere estar autenticado
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Esperar a que termine la carga inicial de sesión
  while (auth.loading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Guard factory: requiere uno de los roles indicados
export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    while (auth.loading()) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    if (auth.hasAnyRole(allowedRoles)) {
      return true;
    }

    // Si está autenticado pero no tiene el rol, redirigir a su home
    if (auth.isAuthenticated()) {
      router.navigate([auth.getHomePath()]);
      return false;
    }

    router.navigate(['/login']);
    return false;
  };
}

// Guard: redirigir si ya está autenticado (para login/registro)
export const noAuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  while (auth.loading()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (auth.isAuthenticated()) {
    router.navigate([auth.getHomePath()]);
    return false;
  }

  return true;
};
