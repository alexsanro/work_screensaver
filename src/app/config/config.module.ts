import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    ReactiveFormsModule
  ]
})
export class ConfigModule { }
