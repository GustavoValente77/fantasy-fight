import { Routes } from '@angular/router';
import { Apostas } from './_components/apostas/apostas';
import { Home } from './pages/home/home';
import { Perfil } from './pages/perfil/perfil';
import { Score } from './pages/score/score';
import { Login } from './_components/login/login';
import { Midia } from './pages/midia/midia';

export const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'perfil', component: Perfil},
  {path: 'score', component: Score},
  {path: 'apostas', component: Apostas},
  {path: 'login', component: Login},
  {path: 'midia', component: Midia},

  { path: '', redirectTo: 'home', pathMatch: 'full' }
];