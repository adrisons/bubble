import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';

import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';

import { CrudService } from './crud.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserData } from '../_models/data';
import { UserStoreService } from './user-store.service';

@Injectable()
/**
 * Una extensión personalizada para reemplazar el servicio http original
 * Permite la configuración de cabeceras en cada llamada
 * Captura todas las respuestas dando oportunidad a procesos centralizados
 * */
export class HttpService extends Http {
  public apiProxyUrl = 'http://localhost:3030/api/';
  private authorization = '';

  constructor(
    backend: XHRBackend,
    defaultOptions: RequestOptions,
    private router: Router,
    private userStore: UserStoreService
  ) {
    super(backend, defaultOptions);
    this.userStore
      .getDataObservable()
      .subscribe((data: UserData) => this.authorization = 'Basic ' + data.token);
  }

  /**
   * Rewrites de base method and performs common actions with every request
   * The current request may be a string or an object
   * If it is astring it should have options
   * */
  request(request: string | Request, options: RequestOptionsArgs = { headers: new Headers() }): Observable<Response> {
    this.configureRequest(request, options);
    return this.interceptResponse(request, options);
  }

  private configureRequest(request: string | Request, options: RequestOptionsArgs) {
    if (typeof request === 'string') {
      request = this.getProxyUrl(request);
      this.setHeaders(options);
    } else {
      request['url'] = this.getProxyUrl(request['url']);
      this.setHeaders(request);
    }
  }
  private interceptResponse(request: string | Request, options: RequestOptionsArgs): Observable<Response> {
    const observableRequest = super
      .request(request, options)
      .catch(this.onCatch())
      .finally(this.onFinally());
    return observableRequest;
  }

  private getProxyUrl(currentUrl) {
    if (!currentUrl.includes('/assets/')) {
      return this.apiProxyUrl + currentUrl;
    } else {
      return currentUrl;
    }
  }

  private setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {
    const headers = objectToSetHeadersTo.headers;
    headers.set('Authorization', this.authorization);
  }

  private onCatch() {
    return (res: Response) => {
      if (this.isError(res)) {
        this.router.navigate(['user/login']);
      }
      return Observable.throw(res);
    };
  }

  private isError(res) {
    return res.status === 401 || res.status === 403 || res.status === 419;
  }

  private onFinally() {
    return () => console.log('end');
  }

}
