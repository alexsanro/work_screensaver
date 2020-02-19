import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config.component';
import { CommonModule } from '@angular/common';


const routes: Routes = [
  {
    path: 'config',
    component: ConfigComponent
  }
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
