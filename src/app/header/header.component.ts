import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isActive = true;
  public isAdmin: boolean = false;
  public authenticated: boolean = false;
  private subscription: Subscription;
  public userName: string = '';
  badge: number = 0;

  constructor(private service: AuthService) { }

  ngOnInit() {
    this.subscription = this.service.authentication$.subscribe(res => {
      this.authenticated = res;
      this.isAdmin = this.service.IsAdmin;
      this.userName = this.service.UserData ? this.service.UserData.email : '';
    });

    if (window.location.hash) {
        this.service.AuthorizedCallback();
    }

    this.authenticated = this.service.IsAuthorized;

    if (this.authenticated) {
      this.isAdmin = this.service.IsAdmin;
        if (this.service.UserData) {
            this.userName = this.service.UserData.email;
        }
    }
  }

  menu() {
    this.isActive = !this.isActive;
  }

  logout() {
    this.service.Signoff();
  }

  login() {
    this.service.Authorize();
  }

}
