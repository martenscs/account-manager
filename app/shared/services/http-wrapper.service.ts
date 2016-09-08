/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';


import { Configuration, IDENTITY_PROVIDER_URL, RESOURCE_SERVER_URL, CLIENT_REDIRECT_URL, CLIENT_ID, ACR_VALUES,
          LoadingService } from '../index';


export const HTTP_LOADING_KEY = 'http';


@Injectable()
export class HttpWrapper {

  bearerToken: string;
  private headers: Headers;

  constructor(private http: Http, private configuration: Configuration, private loadingService: LoadingService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json, application/scim+json');
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.addHeaders(options);

    this.loadingService.start(HTTP_LOADING_KEY);

    return this.http.get(url, options)
        .share()
        .map(this.responseBodyToJson)
        .finally(() => this.loadingService.stop(HTTP_LOADING_KEY));
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.addHeaders(options);

    this.loadingService.start(HTTP_LOADING_KEY);

    return this.http.post(url, body, options)
        .share()
        .map(this.responseBodyToJson)
        .finally(() => this.loadingService.stop(HTTP_LOADING_KEY));
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.addHeaders(options);

    this.loadingService.start(HTTP_LOADING_KEY);

    return this.http.put(url, body, options)
        .share()
        .map(this.responseBodyToJson)
        .finally(() => this.loadingService.stop(HTTP_LOADING_KEY));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.addHeaders(options);

    this.loadingService.start(HTTP_LOADING_KEY);

    return this.http.delete(url, options)
        .share()
        .map(this.responseBodyToJson)
        .finally(() => this.loadingService.stop(HTTP_LOADING_KEY));
  }

  public static parseParams(url: string): Object {
    var params: Object = {}, regex = /([^&=]+)=([^&]*)/g, m: RegExpExecArray;
    url = url.substring(1);
    while (m = regex.exec(url)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  }

  public static decodeCallbackArg(arg: string): string {
    return atob(decodeURIComponent(arg));
  }

  public static parseResponse(res: any) : any {
    if (res && res._body) {
      res = res._body;
      if (res && res[0] === '{') {
        res = JSON.parse(res);
      }
    }
    return res;
  }

  public getUrl(path: string): string {
    return this.buildUrl(this.configuration.basePath, path);
  }

  public getResourceServerUrl(path: string): string {
    return this.buildUrl(RESOURCE_SERVER_URL, path);
  }

  public getAuthorizeUrl(state: number): string {
    var url = this.buildUrl(IDENTITY_PROVIDER_URL, 'oauth/authorize') + '?' +
        'response_type=' + encodeURIComponent('token') + '&' +
        'client_id=' + encodeURIComponent(CLIENT_ID) + '&' +
        'redirect_uri=' + encodeURIComponent(CLIENT_REDIRECT_URL) + '&' +
        'scope=' + encodeURIComponent(this.configuration.requestedScopes) + '&' +
        'state=' + state;
    if (ACR_VALUES) {
      url += '&acr_values=' + encodeURIComponent(ACR_VALUES);
    }
    return url;
  }

  public getLogoutUrl(): string {
    return this.buildUrl(IDENTITY_PROVIDER_URL, 'oauth/logout') + '?' +
        'post_logout_redirect_uri=' + encodeURIComponent(CLIENT_REDIRECT_URL);
  }

  private buildUrl(base: string, path: string): string {
    if (base && base.lastIndexOf('/') === base.length - 1) {
      base = base.substring(0, base.length - 1);
    }
    if (path && path.indexOf('/') === 0) {
      path = path.substring(1);
    }
    return (base || '') + '/' + (path || '');
  }

  private addHeaders(options: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      options = <RequestOptionsArgs> {};
    }
    options.headers = this.headers;
    if (this.bearerToken) {
      options.headers.set('Authorization', 'Bearer ' + this.bearerToken);
    }
    return options;
  }

  private responseBodyToJson(response: Response) : any {
    return (<any>response)._body ? response.json() : {};
  }
}