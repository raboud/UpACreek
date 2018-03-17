import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../shared/services/configuration.service';
import { StorageService } from '../shared/services/storage.service';

interface TOKEN {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  public UserData: any;
  private urlHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    private actionUrl: string;
    private headers: HttpHeaders;
    private authenticationSource = new Subject<boolean>();
    authentication$ = this.authenticationSource.asObservable();
    private authorityUrl = '';
    private token: string = '';

    constructor(
      private _http: HttpClient,
      private _router: Router,
      private _route: ActivatedRoute,
      private _configurationService: ConfigurationService,
      private _storage: StorageService
    ) {
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        this._configurationService.load().subscribe(x => {
            this.authorityUrl = this._configurationService.serverSettings.identityUrl;
            this._storage.store('IdentityUrl', this.authorityUrl);
        });

        if (this._storage.retrieve('IsAuthorized') !== '') {
          this.IsAuthorized = this._storage.retrieve('IsAuthorized');
          this.token = this._storage.retrieve('authorizationData');
          this.UserData = this._storage.retrieve('userData');
          if (this.UserData) {
            if (this.UserData.role === 'admin') {
              this.IsAdmin = true;
            }
          }
          this.authenticationSource.next(this.IsAuthorized);
        }

      }

    public IsAuthorized: boolean = false;
    public IsAdmin: boolean = false;

    public getAuthorizationHeader(): string {
      return 'Bearer ' + this.GetToken();
    }

    public GetToken(): any {
        return this.token;
    }

    private ResetAuthorizationData() {
      this.token = '';
        this._storage.store('authorizationData', '');
        this._storage.store('authorizationDataIdToken', '');

        this.IsAuthorized = false;
        this.IsAdmin = false;
        this._storage.store('IsAuthorized', false);
        this.authenticationSource.next(false);
      }

    private SetAuthorizationData(token: any, id_token: any) {
      this.IsAuthorized = true;
      this.token = token;
        this.getUserData()
            .subscribe(data => {
              console.log(data);
                this.UserData = data;
                if (this.UserData.role === 'admin') {
                  this.IsAdmin = true;
                }
                this._storage.store('userData', data);
                // emit observable
              this._storage.store('authorizationData', token);
              this._storage.store('authorizationDataIdToken', id_token);
              this._storage.store('IsAuthorized', true);

                      this.authenticationSource.next(true);
            },
            error => this.HandleError(error),
            () => {});
    }

    public Signin(userName: string, password: string) {
      const authorizationUrl = this.authorityUrl + '/connect/token';
      const clientId = 'HMSjs';
      const grantType = 'password';
      const scope = 'openid profile catalog orders basket marketing locations';

      const data: string = 'grant_type=' + grantType + '&' +
                         'username=' + userName + '&' +
                         'password=' + password + '&' +
                         'client_id=' + 'ro.client' + '&' +
                         'client_secret=' + 'secret' ;

      this.ResetAuthorizationData();
      this._http.post<TOKEN>(authorizationUrl, data, { headers: this.urlHeaders })
        .subscribe(resp => {
          this.SetAuthorizationData(resp.access_token, null);
        });
    }

    public Authorize() {
        this.ResetAuthorizationData();

        const authorizationUrl = this.authorityUrl + '/connect/authorize';
        const client_id = 'HMSjs';
        const redirect_uri = location.origin + '/home';
        const response_type = 'id_token token';
        const scope = 'openid profile catalog orders basket marketing locations';
        const nonce = 'N' + Math.random() + '' + Date.now();
        const state = Date.now() + '' + Math.random();

        this._storage.store('authStateControl', state);
        this._storage.store('authNonce', nonce);

        const url =
            authorizationUrl + '?' +
            'response_type=' + encodeURI(response_type) + '&' +
            'client_id=' + encodeURI(client_id) + '&' +
            'redirect_uri=' + encodeURI(redirect_uri) + '&' +
            'scope=' + encodeURI(scope) + '&' +
            'nonce=' + encodeURI(nonce) + '&' +
            'state=' + encodeURI(state);

        window.location.href = url;
    }

    public AuthorizedCallback() {
        this.ResetAuthorizationData();

        const hash = window.location.hash.substr(1);
        const result: any = hash.split('&').reduce(function (result2: any, item: string) {
            const parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        let token = '';
        let id_token = '';
        let authResponseIsValid = false;

        if (!result.error) {

            if (result.state !== this._storage.retrieve('authStateControl')) {
            } else {
                token = result.access_token;
                id_token = result.id_token;

                const dataIdToken: any = this.getDataFromToken(id_token);

                // validate nonce
                if (dataIdToken.nonce !== this._storage.retrieve('authNonce')) {
                    console.log('AuthorizedCallback incorrect nonce');
                } else {
                    this._storage.store('authNonce', '');
                    this._storage.store('authStateControl', '');

                    authResponseIsValid = true;
                }
            }
        }


        if (authResponseIsValid) {
            this.SetAuthorizationData(token, id_token);
        }
    }

    public Signoff() {
      const authorizationUrl = this.authorityUrl + '/Account/Signout';

      this._http.get(authorizationUrl)
        .subscribe(resp => {
          this.ResetAuthorizationData();
        });
    }

    public Logoff() {
        const authorizationUrl = this.authorityUrl + '/connect/endsession';
        const id_token_hint = this._storage.retrieve('authorizationDataIdToken');
        const post_logout_redirect_uri = location.origin + '/';

        const url =
            authorizationUrl + '?' +
            'id_token_hint=' + encodeURI(id_token_hint) + '&' +
            'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

        this.ResetAuthorizationData();
        window.location.href = url;
    }

    private HandleError(error: HttpErrorResponse) {
        console.log(error);
        if (error.status === 403) {
            this._router.navigate(['/Forbidden']);
        } else if (error.status === 401) {
            // this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized']);
        }
    }

    private urlBase64Decode(str: string) {
        let output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('Illegal base64url string!');
        }

        return window.atob(output);
    }

    private getDataFromToken(token: any) {
        let data = {};
        if (typeof token !== 'undefined') {
            const encoded = token.split('.')[1];
            const t: string = this.urlBase64Decode(encoded);
            data = JSON.parse(t);
        }
        return data;
    }

    private getUserData = (): Observable<string[]> => {
        this.setHeaders();
        if (this.authorityUrl === '') {
            this.authorityUrl = this._storage.retrieve('IdentityUrl');
        }

        return this._http.get<string[]>(this.authorityUrl + '/connect/userinfo', {
            headers: this.headers,
        });
    }

    private setHeaders() {
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        const token = this.GetToken();

        // if (token !== '') {
        //     this.headers.append('Authorization', 'Bearer ' + token);
        // }
    }
}
