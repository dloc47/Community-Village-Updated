import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

export const idCheckGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const router = inject(Router); // Inject Router instance
  const id = route.paramMap.get('id') || route.queryParamMap.get('id'); // Get ID from path or query params
  const componentPath = route.url[0]?.path || 'search'; // Get first segment as component path

  // If ID is missing or invalid, redirect to /search/{componentPath}
  if (!id || isNaN(Number(id))) {
    console.warn(
      `Invalid or missing ID. Redirecting to /search/${componentPath}`
    );
    return router.createUrlTree([`/search/${componentPath}`]);
  }

  // If ID is valid, stay on the current route/component
  return true;
};
