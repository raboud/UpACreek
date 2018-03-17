import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AuthModule } from './auth/auth.module';
import { BasketModule } from './basket/basket.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CarouselComponent } from './carousel/carousel/carousel.component';
import { DatePickerRangeComponent } from './datepicker/date-picker-range/date-picker-range.component';
import { ProductComponent} from './product/product.component';

import { ProductService } from './Services/product.service';


import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    DatePickerRangeComponent,
    FooterComponent,
    HeaderComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    AuthModule,
    BasketModule,
    SharedModule
  ],
  providers: [ProductService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
