import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ConfigurationService } from '../shared/services/configuration.service';
import { StorageService } from '../shared/services/storage.service';
import { DataService } from '../shared/services/data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ConfigurationService,
    StorageService,
    DataService,
    HttpClientModule
  ]
})
export class SharedModule { }
