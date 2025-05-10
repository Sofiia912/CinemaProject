import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Не залогінений — на /login
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Якщо в маршруті вказані ролі — перевіряємо їх
  const roles = route.data?.['roles'] as string[] | undefined;
  const user = auth.user();
  if (roles?.length && !roles.includes(user?.Role || '')) {
    // користувач є, але не має потрібної ролі — на /home
    router.navigate(['/home']);
    return false;
  }

  // Все гаразд
  return true;
};
