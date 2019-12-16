import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenesActivasPage } from './ordenes-activas.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenesActivasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdenesActivasPage]
})
export class OrdenesActivasPageModule {}
