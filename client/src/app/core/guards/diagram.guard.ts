import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DiagramStorageService } from '@core/services/diagram.service';

export const diagramAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const storageService = inject(DiagramStorageService);
  const router = inject(Router);
  
  const diagramId = route.paramMap.get('id');
  
  return true;
};