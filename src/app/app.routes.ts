import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { RecipeList } from './recipes/recipe-list/recipe-list';
import { RecipeDetail } from './recipes/recipe-detail/recipe-detail';
import { RecipeCreate } from './recipes/recipe-create/recipe-create';
import { PublicationCreate } from './publications/publication-create/publication-create';
import { PublicationList } from './publications/publication-list/publication-list';
import { PublicationDetail } from './publications/publication-detail/publication-detail';
import { ProfileEdit } from './profile/profile-edit/profile-edit';
import { FavoritesList } from './favorites/favorites-list/favorites-list';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'recetas', component: RecipeList },
      { path: 'recetas/nueva', component: RecipeCreate },
      { path: 'recetas/:id', component: RecipeDetail },
      { path: 'publicaciones', component: PublicationList },
      { path: 'publicaciones/nueva', component: PublicationCreate },
      { path: 'publicaciones/:id', component: PublicationDetail },
      { path: 'perfil/editar', component: ProfileEdit },
      { path: 'favoritos', component: FavoritesList },
    ],
  },
  { path: '**', redirectTo: '' },
];
