import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable,  } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { IConfiguration } from '../models';
import { StorageService } from './storage.service';



@Injectable()
export class ConfigurationService {
    serverSettings: IConfiguration;
    // observable that is fired when settings are loaded from server
    private settingsLoadedSource = new Subject<boolean>();
    private settingsLoaded$ = this.settingsLoadedSource.asObservable();
    private isReady: boolean = false;
    private loadingBegun: boolean = false;

    private loadComplete: Observable<boolean> = Observable.create();

    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }

    load(): Observable<boolean> {
      if (!this.isReady) {
        if (!this.loadingBegun) {
          this.loadingBegun = true;
          const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
          const url = `${baseURI}assets/appsettings.json`;
          return this.http.get<IConfiguration>(url).map((response: IConfiguration) => {
              console.log('server settings loaded');
              this.serverSettings = response;
              this.storageService.store('basketUrl', this.serverSettings.basketUrl);
              this.storageService.store('catalogUrl', this.serverSettings.catalogUrl);
              this.storageService.store('identityUrl', this.serverSettings.identityUrl);
              this.storageService.store('orderingUrl', this.serverSettings.orderingUrl);
              this.storageService.store('marketingUrl', this.serverSettings.marketingUrl);
              this.storageService.store('activateCampaignDetailFunction', this.serverSettings.activateCampaignDetailFunction);
              this.settingsLoadedSource.next(true);
              this.isReady = true;
              return true;
            });
        } else {
          return this.settingsLoaded$;
        }
      } else {
        return Observable.of(true);
      }
    }
}
