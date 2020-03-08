import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigComponent } from './config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
