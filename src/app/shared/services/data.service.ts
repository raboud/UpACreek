import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Guid } from '../guid';
import { HttpJsonParseError } from '@angular/common/http/src/response';

// Implementing a Retry-Circuit breaker policy
// is pending to do for the SPA app
@Injectable()
export class DataService {
    constructor(private http: HttpClient) { }

    getFullResp<type>(url: string): Observable<HttpResponse<type>> {
      console.log('getFullResp ' + url);
      return this.http.get<type>(
        url, { observe: 'response' });
    }

    get<type>(url: string, params?: any): Observable<type> {
      console.log('get ' + url);
       return this.http.get<type>(url)
       .pipe(
          map((d) => d ),
          catchError(this.handleError)
       );
    }

    postWithId<t>(url: string, data: any, params?: any): Observable<HttpResponse<t>> {
        return this.doPost<t>(url, data, true, params);
    }

    post<t>(url: string, data: any, params?: any): Observable<HttpResponse<t>> {
        return this.doPost<t>(url, data, false, params);
    }

    putWithId<t>(url: string, data: any, params?: any): Observable<HttpResponse<t>> {
        return this.doPut(url, data, true, params);
    }

    put<t>(url: string, data: any, params?: any): Observable<HttpResponse<t>> {
      return this.doPut(url, data, false, params);
  }

    private doPost<t>(url: string, data: any, needId: boolean, params?: any): Observable<HttpResponse<t>> {
      const options: HttpHeaders = new HttpHeaders();

        if (needId) {
            const guid = Guid.newGuid();
            options.append('x-requestid', guid);
        }

        return this.http.post(url, data, {headers: options,  observe: 'response' }).pipe(
          map(
            (res: HttpResponse<t>) => {
                return res;
            }),
            catchError(this.handleError)
          );
    }

    private doPut<t>(url: string, data: any, needId: boolean, params?: any): Observable<HttpResponse<t>> {
      const options: HttpHeaders = new HttpHeaders();

        if (needId) {
            const guid = Guid.newGuid();
            options.append('x-requestid', guid);
        }

        return this.http.put(url, data, {headers: options,  observe: 'response'})
          .pipe(
            map(
              (res:  HttpResponse<t>) => {
                return res;
              }),
              catchError(this.handleError)
            );
    }

    delete(url: string, params?: any): Observable<boolean> {
        return this.http.delete(url)
          .pipe(
            map((res) => {
              return true;
            }),
            catchError(this.handleError)
          );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('server error:', error);
        if (error instanceof HttpErrorResponse) {
            let errMessage = '';
            try {
                errMessage = error.message;
            } catch (err) {
                errMessage = error.statusText;
            }
            return Observable.throw(errMessage);
        }
        return Observable.throw(error || 'server error');
    }
}
