/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';


enum IdentityProviderTypes { Broker, PingFederate }


// NOTE: Override these for local development (examples below).
export const IDENTITY_PROVIDER_URL = '/';
export const CLIENT_REDIRECT_URL = '/samples/account-manager/callback.html';
//export const IDENTITY_PROVIDER_URL = 'https://localhost:8445/';
//export const CLIENT_REDIRECT_URL = 'http://localhost:3006/callback.html';

// NOTE: Override this when the IDP and resource server are not a single Data Governance Broker instance.
export const RESOURCE_SERVER_URL = IDENTITY_PROVIDER_URL;

// NOTE: Override this when using PingFederate as the IDP (example below).
const IDENTITY_PROVIDER_TYPE = IdentityProviderTypes.Broker;
//const IDENTITY_PROVIDER_TYPE = IdentityProviderTypes.PingFederate;


const IDENTITY_PROVIDER_CONFIG: any = {};
// Broker IDP configuration (revoke is not required since logout endpoint handles it)
IDENTITY_PROVIDER_CONFIG[IdentityProviderTypes.Broker] = {
  AUTH_ENDPOINT: 'oauth/authorize',
  LOGOUT_ENDPOINT: 'oauth/logout'
};
// PingFederate IDP configuration
IDENTITY_PROVIDER_CONFIG[IdentityProviderTypes.PingFederate] = {
  AUTH_ENDPOINT: 'as/authorization.oauth2',
  REVOKE_ENDPOINT: 'as/revoke_token.oauth2',
  LOGOUT_ENDPOINT: 'idp/startSLO.ping'
};


export const CLIENT_ID = '@account-manager@';

export const URN_PREFIX = 'urn:pingidentity:';
export const SCOPE_PREFIX = URN_PREFIX + 'scope:admin:';

export enum Functionality { Register, Account, Entitlements, Password, ExternalIdentities, Sessions, Consents,
    SecondFactor }

export const REQUIRED_SCOPES = [ SCOPE_PREFIX + 'profiles' ];

export const OPTIONAL_SCOPES_BY_FUNCTIONALITY = {};
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Register] = [ SCOPE_PREFIX + 'register_account' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Account] = [ SCOPE_PREFIX + 'account_state' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Entitlements] = [ SCOPE_PREFIX + 'entitlements' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Password] = [
    SCOPE_PREFIX + 'password_quality_requirements',
    SCOPE_PREFIX + 'change_password'
  ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.ExternalIdentities] = [ SCOPE_PREFIX + 'external_identities' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Sessions] = [ SCOPE_PREFIX + 'sessions' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.Consents] = [ SCOPE_PREFIX + 'consents' ];
OPTIONAL_SCOPES_BY_FUNCTIONALITY[Functionality.SecondFactor] = [
    SCOPE_PREFIX + 'validated_email_address',
    SCOPE_PREFIX + 'validated_phone_number',
    SCOPE_PREFIX + 'totp'
  ];

const BROKER_IDP_ONLY_FUNCTIONALITY = [ Functionality.ExternalIdentities, Functionality.Sessions,
  Functionality.Consents, Functionality.SecondFactor ];

export const ACR_VALUES = ''; // if no values are specified the defaults will be used

export const MESSAGING_PROVIDERS = {
  SMS: 'Twilio SMS Provider',
  VOICE: 'Twilio Voice Provider'
};


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

    // always false if Broker only and not Broker IDP
    brokerOnly = BROKER_IDP_ONLY_FUNCTIONALITY.indexOf(f) !== -1;
    if (brokerOnly && ! this.isBrokerIdp) {
      return false;
    }

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

  get isBrokerIdp(): boolean {
    return IDENTITY_PROVIDER_TYPE === IdentityProviderTypes.Broker;
  }

  get isPingFederateIdp(): boolean {
    return IDENTITY_PROVIDER_TYPE === IdentityProviderTypes.PingFederate;
  }

  get idpConfig(): any {
    return IDENTITY_PROVIDER_CONFIG[IDENTITY_PROVIDER_TYPE];
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
