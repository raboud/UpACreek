import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {

  public blackedOut: number[];
  public fromDate: number;
  public toDate: number;
  public minDate: number;

  constructor() {
    this.blackedOut = [ new Date(2018, 3, 13).valueOf(), new Date(2018, 3, 24).valueOf()];
    this.fromDate = null;
    this.toDate = null;
    this.minDate  = Date.now();
  }

  public GetNumberOfDays(): number {
    if (!this.fromDate && !this.toDate) {
      return 0;
    } else if (this.fromDate && !this.toDate) {
      return 1;
    } else {
      return Math.floor((this.toDate - this.fromDate) / (24 * 3600 * 1000)) + 1;
    }
  }

  public GetCost(): number {
    let cost = 0;
    let costPerDay = 0;
    const numberOfDays = this.GetNumberOfDays();

    if (numberOfDays < 2) {
      costPerDay = 65;
    } else if (numberOfDays < 7) {
      costPerDay = 45;
    } else {
      costPerDay = 40;
    }

    cost = costPerDay * numberOfDays;

    return cost;
  }
}
