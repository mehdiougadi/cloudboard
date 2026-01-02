import { Routes } from '@angular/router';
import { diagramAccessGuard } from './core/guards/diagram.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./features/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: 'diagram/:id',
    loadComponent: () => 
      import('./features/diagram/diagram').then(m => m.Diagram),
    canActivate: [diagramAccessGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];