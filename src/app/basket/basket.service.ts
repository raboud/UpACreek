import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { StorageService } from '../shared/services/storage.service';

import { IBasket, IBasketItem, IBasketCheckout } from './models';
import { Guid } from '../shared/guid';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BasketService {
    private basketUrl: string = '';
    basket: IBasket = {
        buyerId: '',
        items: []
    };

        // observable that is fired when a product is added to the cart
        private basketUpdateSource = new Subject<boolean>();
        public basketUpdated$: Observable<boolean> = this.basketUpdateSource.asObservable();

    constructor(
      private service: DataService,
      private authService: AuthService,
      private router: Router,
      private configurationService: ConfigurationService,
      private storageService: StorageService
    ) {
        this.basket.items = [];
        this.configurationService.load().subscribe(() => {
          this.basketUrl = this.configurationService.serverSettings.basketUrl;
          if (this.authService.IsAuthorized) {
            this.basket.buyerId = this.authService.UserData.sub;
            this.loadData();
          }
          this.authService.authentication$.subscribe((auth) => {
            if (auth) {
              this.basket.buyerId = this.authService.UserData.sub;
              this.loadData();
            } else {
              this.basket.buyerId = '';
              this.basket.items = [];
            }
        });
      });
    }

    getItemCount(): number {
      let sum = 0;
      if (this.basket) {
        this.basket.items.forEach(element => {
          sum += element.quantity;
        });
      }
      return sum;
    }
/*
    addItemToBasket(product: IProduct) {
      if (this.authService.IsAuthorized) {
        const inList: IBasketItem = this.basket.items.find(i => i.productId === product.Id.toString());
        if (inList) {
          inList.quantity += 1;
        } else {
          const item: IBasketItem = {
              pictureUrl: product.PictureUri,
              productId: product.Id.toString(),
              productName: product.Name,
              quantity: 1,
              unitPrice: product.Price,
              id: Guid.newGuid(),
              oldUnitPrice: 0
          };
          this.basket.items.push(item);
        }
        this.basketUpdateSource.next(true);

        this.setBasket().subscribe();
      } else {
          this.authService.Authorize();
      }
  }
 */
  public UpdateBasket(basket: IBasket): Observable<boolean> {
    this.basket = basket;
    this.basket.items = this.basket.items.filter( x => x.quantity > 0);
    return this.setBasket();
  }

    private setBasket(): Observable<boolean> {
        const url = this.basketUrl + '/api/v1/basket/';
        return this.service.post<IBasket>(url, this.basket)
          .pipe(
            map((b) => {
              this.basket = b.body;
              this.basketUpdateSource.next(true);
              return true;
            })
          );
    }

    setBasketCheckout(basketCheckout): Observable<boolean> {
        const url = this.basketUrl + '/api/v1/basket/checkout';
        return this.service.postWithId(url, basketCheckout)
          .pipe(
            map(() => {
              this.basketUpdateSource.next(true);
              return true;
            })
          );
    }

    private getBasket(): Observable<IBasket> {
      console.log('getBasket ' + this.basket.buyerId);
        const url = this.basketUrl + '/api/v1/basket/' + this.basket.buyerId;
        return this.service.getFullResp<IBasket>(url)
          .pipe(
            map(resp => {
              if (resp.status === 204) {
                return null;
              }
              this.basket = resp.body;
              this.basketUpdateSource.next(true);
              return resp.body;
            })
          );
    }
/*
    mapBasketInfoCheckout(order: IOrder): IBasketCheckout {
        const basketCheckout = <IBasketCheckout>{};

        basketCheckout.street = order.street;
        basketCheckout.city = order.city;
        basketCheckout.country = order.country;
        basketCheckout.state = order.state;
        basketCheckout.zipcode = order.zipcode;
        basketCheckout.cardexpiration = order.cardexpiration;
        basketCheckout.cardnumber = order.cardnumber;
        basketCheckout.cardsecuritynumber = order.cardsecuritynumber;
        basketCheckout.cardtypeid = order.cardtypeid;
        basketCheckout.cardholdername = order.cardholdername;
        basketCheckout.total = 0;
        basketCheckout.expiration = order.expiration;

        return basketCheckout;
    }
 */
    dropBasket() {
        this.basket.items = [];
        this.basketUpdateSource.next();
    }

    private loadData() {
        this.getBasket().subscribe(basket => {
            if (basket != null) {
              this.basket = basket;
            }
        });
    }
}
