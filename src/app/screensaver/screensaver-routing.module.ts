import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScreensaverComponent } from './screensaver.component';


const routes: Routes = [
  {
    path: 'screensaver/:file',
    component: ScreensaverComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreensaverRoutingModule { }
