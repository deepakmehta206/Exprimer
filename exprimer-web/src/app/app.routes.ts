import { Routes } from '@angular/router';
import { CmsPage } from './pages/cms-page/cms-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: ':slug', component: CmsPage },
  { path: '**', redirectTo: 'home' },
];
