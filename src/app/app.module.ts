import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CarouselComponent } from './carousel/carousel/carousel.component';
import { DatePickerRangeComponent } from './datepicker/date-picker-range/date-picker-range.component';
import { ProductComponent} from './product/product.component';
import { ProductService } from './Services/product.service';

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    DatePickerRangeComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
