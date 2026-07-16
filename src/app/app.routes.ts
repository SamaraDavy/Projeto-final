import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LgpdComponent } from './pages/lgpd/lgpd.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MapasComponent } from './pages/mapas/mapas.component';
import { AnotacaoComponent } from './pages/anotacao/anotacao.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },

  {
    path: 'cadastro',
    component: CadastroComponent,
    canActivate: [publicGuard]
  },

  {
    path: 'lgpd',
    component: LgpdComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'mapas',
        component: MapasComponent
      },

      {
        path: 'anotacao',
        component: AnotacaoComponent
      },

      {
        path: 'perfil',
        component: PerfilComponent
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
