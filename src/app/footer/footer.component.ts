import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../shared/services/configuration.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  name: string = '';
  address1: string = '';
  address2: string = '';
  city_state_zip: string = '';
  phone: string = '';
  fax: string = '';

  constructor(private config: ConfigurationService) {
    this.config.load().subscribe(x => {
      this.name = this.config.serverSettings.Name;
      this.address1 = this.config.serverSettings.Address1;
      this.address2 = this.config.serverSettings.Address2;
      this.city_state_zip = this.config.serverSettings.City;
      this.city_state_zip += ', ' + this.config.serverSettings.State;
      this.city_state_zip += ' ' + this.config.serverSettings.Zip;
      this.phone = this.config.serverSettings.Phone;
      this.fax = this.config.serverSettings.Fax;
  });
}

  ngOnInit() {
  }

}
