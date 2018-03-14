import { Component, OnInit } from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss']
})

export class DatePickerRangeComponent implements OnInit {

  hoveredDate: number;
  minDate: NgbDateStruct ;

  constructor(calendar: NgbCalendar, private productService: ProductService) {
    const e =  1234567890;

    const d2 = new Date(1234567890);
    const d1 = new Date(e);
    const d = new Date(parseInt(e.toString(), 10));

    this.minDate  = this.GetDateStruct(new Date(this.productService.minDate));
  }

  onDateChange(date: NgbDateStruct) {
    const d = this.GetDate(date);
    if (!this.productService.fromDate && !this.productService.toDate) {
      this.productService.fromDate = d;
    } else if (this.productService.fromDate && !this.productService.toDate && d > this.productService.fromDate) {
      if (!this.checkBlackout(date)) {
        this.productService.toDate = d;
      }
    } else {
      this.productService.toDate = null;
      this.productService.fromDate = d;
    }
  }

  public setHoverDate(date: NgbDateStruct) {
    if (date) {
      this.hoveredDate = this.GetDate(date);
    } else {
      this.hoveredDate = null;
    }
  }

  isHovered(date: NgbDateStruct): boolean {
    const d = this.GetDate(date);
    return this.productService.fromDate && !this.productService.toDate && this.hoveredDate &&
    d > this.productService.fromDate && d < this.hoveredDate;
  }

  isInside(date: NgbDateStruct): boolean {
    const d = this.GetDate(date);
    return d > this.productService.fromDate && d < this.productService.toDate;
  }

  isFrom(date: NgbDateStruct): boolean {
    const d = this.GetDate(date).valueOf();
    return d === this.productService.fromDate;
  }

  isTo(date: NgbDateStruct): boolean {
    const d = this.GetDate(date);
    return d === this.productService.toDate;
  }

  isDisabled(date: NgbDateStruct) {
    if (this) {
      const d = this.GetDate(date);
      return (this.productService.blackedOut.includes(d.valueOf()) || d < this.productService.minDate) ;
    } else {
      return false;
    }
  }

  ngOnInit() {
  }

  checkBlackout(date: NgbDateStruct) {
    const from = this.productService.fromDate;
    const to = this.GetDate(date).valueOf();
    return this.productService.blackedOut.some(d => d >= from && d <= to);
  }

  GetDate(date: NgbDateStruct): number {
    return new Date(date.year, date.month - 1, date.day).valueOf();
  }

  GetDateStruct(date: Date): NgbDateStruct {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  GetNumberOfDays(): number {
    return this.productService.GetNumberOfDays();
  }

  GetCost(): number {
    return this.productService.GetCost();
  }

}

