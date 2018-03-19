import { Component } from '@angular/core';
import brands from '@fortawesome/fontawesome-free-brands';
import regular from '@fortawesome/fontawesome-free-regular';
import solid from '@fortawesome/fontawesome-free-solid';
import { library } from '@fortawesome/fontawesome';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Up a Creek';
  isSyncAnimated = true;
  magicLevel = 0;

  constructor() {
    library.add(solid);
    library.add(regular);
    library.add(brands);
  }
}
