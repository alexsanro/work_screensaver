import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreensaverRoutingModule } from './screensaver-routing.module';
import { ScreensaverComponent } from './screensaver.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ScreensaverComponent],
  imports: [
    CommonModule,
    SharedModule,
    ScreensaverRoutingModule
  ]
})
export class ScreensaverModule { }
