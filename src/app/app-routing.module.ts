import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LogedGuard } from './guards/loged.guard';
import { AdminGuard } from './guards/admin.guard';
import { ModeradorGuard } from './guards/moderador.guard';
const routes: Routes = [
  { path: '',redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'ordenes', canActivate:[LogedGuard],loadChildren: './ordenes/ordenes.module#OrdenesPageModule' },
  { path: 'restaurantes',canActivate:[LogedGuard], loadChildren: './restaurantes/restaurantes.module#RestaurantesPageModule' },
  { path: 'administracion',canActivate:[AdminGuard], loadChildren: './administracion/administracion.module#AdministracionPageModule' },
  { path: 'moderador', canActivate:[ModeradorGuard], loadChildren: './moderador/moderador.module#ModeradorPageModule' },
  { path: 'menu',canActivate:[ModeradorGuard], loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'ordenes-activas',canActivate:[LogedGuard], loadChildren: './ordenes-activas/ordenes-activas.module#OrdenesActivasPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
