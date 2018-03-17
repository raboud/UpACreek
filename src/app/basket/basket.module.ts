import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasketRoutingModule } from './basket-routing.module';
import { BasketService } from './basket.service';
import { BasketComponent } from './basket.component';
import { BasketStatusComponent } from './basket-status.component';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    BasketRoutingModule,
    SharedModule,
    AuthModule
  ],
  declarations: [BasketComponent, BasketStatusComponent],
  providers: [BasketService]
})
export class BasketModule { }
