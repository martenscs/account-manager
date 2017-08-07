/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';



// NOTE: Override these for local development (examples below).
//export const IDENTITY_PROVIDER_URL = 'https://my-pingfed-server:9031'; // https://[ping-federate-hostname]:[oath-port]'
//export const CLIENT_REDIRECT_URL = '/samples/account-manager/callback.html'; // https://[data-governance-hostname]:[https-port]/callback.html
//export const RESOURCE_SERVER_URL = '/'; // https://[data-governance-hostname]:[https-port]
export const CLIENT_REDIRECT_URL = 'http://localhost:3006/callback.html';
export const RESOURCE_SERVER_URL = 'https://broker.aus-qa1.ping-eng.com:8443';
export const IDENTITY_PROVIDER_URL = 'https://ping-federate.aus-qa1.ping-eng.com:9031';

export const IDENTITY_PROVIDER_AUTH_ENDPOINT = 'as/authorization.oauth2';
export const IDENTITY_PROVIDER_LOGOUT_ENDPOINT = '/idp/startSLO.ping';


//export const CLIENT_ID = '@account-manager@';
export const CLIENT_ID = 'test';
export const URN_PREFIX = 'urn:pingidentity:';
export const SCOPE_PREFIX = URN_PREFIX + 'scope:admin:';

export enum Functionality { Register, Account, Entitlements, Password }

export const REQUIRED_SCOPES = [ SCOPE_PREFIX + 'profiles' ];

export const OPTIONAL_SCOPES_BY_FUNCTIONALITY = {};
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Register] = [ SCOPE_PREFIX + 'register_account' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Account] = [ SCOPE_PREFIX + 'account_state' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Entitlements] = [ SCOPE_PREFIX + 'entitlements' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Password] = [SCOPE_PREFIX + 'change_password'];


@Injectable()
export class Configuration {
  private window: Window;
  private _basePath: string;
  private _version: string = 'UNKNOWN';
  private _grantedScopes: string[] = [];

  get basePath(): string {
    return this._basePath;
  }

  get version(): string {
    return this._version;
  }

  get requestedScopes(): string {
    var scopes: string[] = [].concat(REQUIRED_SCOPES);

    Object.keys(OPTIONAL_SCOPES_BY_FUNCTIONALITY).forEach(key =>
        scopes = scopes.concat(OPTIONAL_SCOPES_BY_FUNCTIONALITY[key]));

    return scopes.join(' ');
  }

  get grantedScopes(): string[] {
    return this._grantedScopes;
  }

  set grantedScopes(value: string[]) {
    this._grantedScopes = value;
  }

  hasRequiredScopes(f?: Functionality): boolean {
    var brokerOnly: boolean, requiredScopes: string[], i: number;

    // check either the required scopes or the given functionality's scopes
    requiredScopes = f !== undefined ? OPTIONAL_SCOPES_BY_FUNCTIONALITY[f] : REQUIRED_SCOPES;

    // verify we have all the scopes...
    for (i = 0; i < requiredScopes.length; i++) {
      if (this.grantedScopes.indexOf(requiredScopes[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  constructor(@Inject(Window) window: Window, private http: Http) {
    this.window = window;
    this.init();
  }

  private init() {
    // determine the base path
    var loc = this.window.location;
    this._basePath = loc.protocol + '//' + loc.host +
        (loc.pathname ? loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1) : '/');

    // read the version from the package.json file
    this.http.get(this._basePath + 'package.json')
        .map((res:Response) => res.json())
        .subscribe((data:any) => {
              this._version = data.version;
            }, () => {});
  }
}
