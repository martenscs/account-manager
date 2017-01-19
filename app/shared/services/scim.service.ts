/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Injectable, Inject } from '@angular/core';
import { Response, URLSearchParams, QueryEncoder } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/empty';

import { Configuration, AlertService, AlertType, HttpWrapper, LoadingService, Utility, Profile,
    URN_PREFIX, Functionality } from '../index';


const STORAGE_KEY: any = {
  STATE: 'account_manager_state'
};


@Injectable()
export class ScimService {

  private window: Window;

  public initialized: boolean = false;

  public error: any;

  private profile: BehaviorSubject<Profile> = new BehaviorSubject(undefined);
  private _profile$: Observable<Profile> = this.profile.asObservable();

  private accountState: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private _accountState$: Observable<any> = this.accountState.asObservable();

  private passwordQualityRequirements: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private _passwordQualityRequirements$: Observable<any> = this.passwordQualityRequirements.asObservable();

  private sessions: BehaviorSubject<any[]> = new BehaviorSubject(undefined);
  private _sessions$: Observable<any> = this.sessions.asObservable();

  private consents: BehaviorSubject<any[]> = new BehaviorSubject(undefined);
  private _consents$: Observable<any> = this.consents.asObservable();

  private externalIdentities: BehaviorSubject<any[]> = new BehaviorSubject(undefined);
  private _externalIdentities$: Observable<any> = this.externalIdentities.asObservable();

  private validatedEmailAddress: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private _validatedEmailAddress$: Observable<any> = this.validatedEmailAddress.asObservable();

  private validatedPhoneNumber: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private _validatedPhoneNumber$: Observable<any> = this.validatedPhoneNumber.asObservable();

  private totpSharedSecret: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private _totpSharedSecret$: Observable<any> = this.totpSharedSecret.asObservable();

  private criticalError: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private _criticalError$: Observable<any> = this.criticalError.asObservable();

  private handleError = (err: Response) => {
    var error: any = this.formatError(err);
    // is it a critical error?
    if (error.details === '401' || error.details === 'ProgressEvent') {
      this.error = error;
      this.criticalError.next(this.error);
    }
    else {
      // not critical, just alert it
      this.alertService.add(error.message);
    }
  };

  constructor(@Inject(Window) window: Window,
              private configuration: Configuration,
              private alertService: AlertService,
              private httpWrapper: HttpWrapper,
              private loadingService: LoadingService) {

    this.window = window;

    this.init();
  }
  
  init() {
    // process the initial search params when the app/service loads
    var params: Object = HttpWrapper.parseParams(this.window.location.search);
    var scopes: string[], grantedScopes: string[], parts: string[], jsonToken: any, state: number, uri: string;
    if (params['chash']) {
      // this is an OAuth callback
      params = HttpWrapper.parseParams(HttpWrapper.decodeCallbackArg(params['chash']));
      if (params['access_token']) {
        // validate state
        if (params['state'] !== this.window.sessionStorage.getItem(STORAGE_KEY.STATE)) {
          this.error = this.formatError('The given state value (' + params['state'] + ') does not match what was ' +
              'sent with the request (' + this.window.sessionStorage.getItem(STORAGE_KEY.STATE) + ')');
        }
        else {
          // validate the granted scopes (retrieved either by query parameter (Broker) or JWT (PingFederate))
          grantedScopes = params['scope'] ? params['scope'].split(' ') : [];
          if (grantedScopes.length === 0) {
            parts = params['access_token'].split('.');
            if (parts.length === 3) {
              jsonToken = JSON.parse(atob(parts[1]));
              if (jsonToken && jsonToken.scope) {
                grantedScopes = jsonToken.scope;
              }
            }
          }
          this.configuration.grantedScopes = grantedScopes;
          if (! this.configuration.hasRequiredScopes()) {
            this.error = this.formatError('The application was not granted the required scopes.  Make sure you are ' +
                'signing in with a privileged account.');
          }
        }
        if (! this.error) {
          this.httpWrapper.bearerToken = params['access_token'];
        }
      }
      else if (params['error']) {
        this.error = this.formatError(params['error_description'] || params['error'],
            params['error_description'] ? params['error'] : undefined);
      }
      else {
        this.error = this.formatError('Unexpected OAuth callback parameters');
      }
    }
    else {
      // redirect for access token
      state = Utility.getRandomInt(0, 999999);
      this.window.sessionStorage.setItem(STORAGE_KEY.STATE, state.toString());
      uri = this.httpWrapper.getAuthorizeUrl(state);
      this.window.location.assign(uri);
      return;
    }
    this.initialized = true;
  }

  get profile$(): Observable<Profile> {
    return this._profile$;
  }

  get accountState$(): Observable<any> {
    // lazy-load the state
    if (! this.accountState.getValue()) {
      this.fetchAccountState();
    }
    return this._accountState$;
  }

  get passwordQualityRequirements$(): Observable<any> {
    // lazy-load the requirements
    if (! this.passwordQualityRequirements.getValue()) {
      this.fetchPasswordQualityRequirements();
    }
    return this._passwordQualityRequirements$;
  }

  get sessions$(): Observable<any[]> {
    // lazy-load the sessions (and force refresh every subscription)
    this.fetchSessions();
    return this._sessions$;
  }

  get consents$(): Observable<any[]> {
    // lazy-load the consents
    if (! this.consents.getValue()) {
      this.fetchConsents();
    }
    return this._consents$;
  }

  get externalIdentities$(): Observable<any[]> {
    // lazy-load the external identities
    if (! this.externalIdentities.getValue()) {
      this.fetchExternalIdentities();
    }
    return this._externalIdentities$;
  }

  get validatedEmailAddress$(): Observable<any[]> {
    // lazy-load the validated email addresses
    if (! this.validatedEmailAddress.getValue()) {
      this.fetchValidatedEmailAddress();
    }
    return this._validatedEmailAddress$;
  }

  get validatedPhoneNumber$(): Observable<any[]> {
    // lazy-load the validated phone number
    if (! this.validatedPhoneNumber.getValue()) {
      this.fetchValidatedPhoneNumber();
    }
    return this._validatedPhoneNumber$;
  }

  get totpSharedSecret$(): Observable<any[]> {
    // lazy-load the TOTP secret information
    if (! this.totpSharedSecret.getValue()) {
      this.fetchTotpSharedSecret();
    }
    return this._totpSharedSecret$;
  }

  get criticalError$(): Observable<any> {
    return this._criticalError$;
  }

  selectProfile(profile: Profile, clearCache = true) {
    if (clearCache) {
      this.profile.next(undefined);
      this.accountState.next(undefined);
      this.passwordQualityRequirements.next(undefined);
      this.sessions.next(undefined);
      this.consents.next(undefined);
      this.externalIdentities.next(undefined);
      this.validatedEmailAddress.next(undefined);
      this.validatedPhoneNumber.next(undefined);
      this.totpSharedSecret.next(undefined);
    }
    if (profile) {
      this.profile.next(profile);
      if (clearCache) {
        // also, pre-fetch the account state and password quality requirements so we have them up front if they disable
        // account or change password
        this.fetchAccountState();
        this.fetchPasswordQualityRequirements();
      }
    }
  }

  get isProfileSelected(): boolean {
    return !! this.profile.getValue();
  }

  refreshProfile(clearCache = false): Observable<Profile> {
    var o = this.httpWrapper.get(this.getAccountUrl());
    o.subscribe((data: any) => this.selectProfile(new Profile(data), clearCache),
        this.handleError);
    return o;
  }

  fetchAccountState(): Observable<any> {
    if (! this.profile.getValue() || ! this.configuration.hasRequiredScopes(Functionality.Account)) {
      return Observable.empty();
    }
    var o = this.httpWrapper.get(this.getAccountUrl('account'));
    o.subscribe((data: any) => this.accountState.next(data),
        this.handleError);
    return o;
  }

  fetchPasswordQualityRequirements(): Observable<any> {
    if (! this.configuration.hasRequiredScopes(Functionality.Password)) {
      return Observable.empty();
    }
    var o = this.httpWrapper.get(this.getAccountUrl('passwordQualityRequirements'));
    o.subscribe((data: any) => this.passwordQualityRequirements.next(data),
        this.handleError);
    return o;
  }

  fetchSessions(): Observable<any[]> {
    if (! this.configuration.hasRequiredScopes(Functionality.Sessions)) {
      return Observable.empty();
    }
    var o = this.httpWrapper.get(this.getAccountUrl('sessions'));
    o.subscribe((data: any) => {
          if (data.Resources) {
            data.Resources.forEach((session: any) => {
              session.platform = platform.parse(session.userAgentString);
            });
          }
          this.sessions.next(data.Resources);
        },
        this.handleError
    );
    return o;
  }

  fetchConsents(): Observable<any[]> {
    if (! this.configuration.hasRequiredScopes(Functionality.Consents)) {
      return Observable.empty();
    }
    var o = this.httpWrapper.get(this.getAccountUrl('consents'));
    o.subscribe(
        (data: any) => {
          if (data.Resources) {
            data.Resources.forEach(this.processRecord);
          }
          this.consents.next(data.Resources);
        },
        this.handleError
    );
    return o;
  }

  fetchExternalIdentities(): Observable<any[]> {
    if (! this.configuration.hasRequiredScopes(Functionality.ExternalIdentities)) {
      return Observable.empty();
    }
    var o = this.httpWrapper.get(this.getAccountUrl('externalIdentities'));
    o.subscribe(
        (data: any) => this.externalIdentities.next(data.Resources),
        this.handleError
    );
    return o;
  }

  fetchValidatedEmailAddress(): Observable<any> {
    if (! this.configuration.hasRequiredScopes(Functionality.SecondFactor)) {
      return Observable.empty();
    }
    var attributePath = 'secondFactorEmail';
    var o = this.httpWrapper.get(this.getAccountUrl('validatedEmailAddresses' +
        '?filter=attributePath eq "' + attributePath + '"'));
    o.subscribe(
        (data: any) => {
          if (! data.totalResults) {
            this.alertService.add('validatedEmailAddresses returned no results for attributePath "' + attributePath +
                '". Verify the Email Validator SCIM Sub Resource Type Handler is configured properly for this sample.');
            data = undefined;
          }
          else {
            data = this.processRecord(data.Resources[0]);
          }
          return this.validatedEmailAddress.next(data);
        },
        this.handleError
    );
    return o;
  }

  fetchValidatedPhoneNumber(): Observable<any> {
    if (! this.configuration.hasRequiredScopes(Functionality.SecondFactor)) {
      return Observable.empty();
    }
    var attributePath = 'secondFactorPhoneNumber';
    var o = this.httpWrapper.get(this.getAccountUrl('validatedPhoneNumbers' +
        '?filter=attributePath eq "' + attributePath + '"'));
    o.subscribe(
        (data: any) => {
          if (! data.totalResults) {
            this.alertService.add('validatedPhoneNumbers returned no results for attributePath "' + attributePath +
                '". Verify the Telephony Validator SCIM Sub Resource Type Handler is configured properly for this ' +
                'sample.');
            data = undefined;
          }
          else {
            data = this.processRecord(data.Resources[0]);
          }
          return this.validatedPhoneNumber.next(data);
        },
        this.handleError
    );
    return o;
  }

  fetchTotpSharedSecret(): Observable<any> {
    if (! this.configuration.hasRequiredScopes(Functionality.SecondFactor)) {
      return Observable.empty();
    }
    var o = this.httpWrapper.get(this.getAccountUrl('totpSharedSecret'));
    o.subscribe(
        (data: any) => this.totpSharedSecret.next(this.processRecord(data)),
        this.handleError
    );
    return o;
  }

  queryUsers(filter: string): Observable<any> {
    // remove any double-quotes in the filter (we don't escape as it is unlikely they intend to search for
    //   quotes in these fields...)
    if (filter) {
      filter = filter.replace(/"/g, '');
    }
    // build the filter string
    // NOTE: This search implementation has several caveats:
    //   - We only search the default resource type
    //   - The query built assumes the default User schema fields
    //   - We currently use a contains match on name.* and an exact match on the other fields due to the potential
    //     server performance impact of using contains without substring indexes
    //   - We retrieve all results instead of paging them
    //   - The server will throw an exception if the query matches more than 500 results (by default, configurable)
    var indexedOperation = 'co';
    var nonIndexedOperation = 'eq';
    var query = 'userName ' + nonIndexedOperation + ' "' + filter + '" or ' +
        'name.givenName ' + indexedOperation + ' "' + filter + '" or ' +
        'name.familyName ' + indexedOperation + ' "' + filter + '" or ' +
        'name.formatted ' + indexedOperation + ' "' + filter + '" or ' +
        'emails.value ' + nonIndexedOperation + ' "' + filter + '" or ' +
        'phoneNumbers.value ' + nonIndexedOperation + ' "' + filter + '"';

    // NOTE: use CustomQueryEncoder so that we escape any plus signs in the filter
    var params = new URLSearchParams('', new CustomQueryEncoder());
    params.set('filter', query);

    var o = this.httpWrapper.get(this.getUrl('Users'), { search: params });
    o.subscribe((data: any) => data,
        this.handleError);
    return o;
  }

  updateProfile(profile: Profile,
                updateCommunicationContentOptions = false,
                updateTopicPreferences = false): Observable<any> {
    // ensure the full name attribute is populated from the other name attributes
    Profile.updateFullName(profile);
    // update the profile
    var o = this.httpWrapper.put(Profile.getLocation(profile), JSON.stringify(Profile.toScim(profile,
        updateCommunicationContentOptions, updateTopicPreferences)));
    o.subscribe((data: any) => this.profile.next(new Profile(data)),
        this.handleError);
    return o;
  }

  createProfile(profile: Profile): Observable<any> {
    // ensure the full name attribute is populated from the other name attributes
    Profile.updateFullName(profile);
    // save the profile
    var o = this.httpWrapper.post(this.getUrl('Users'), JSON.stringify(Profile.toScim(profile)));
    o.subscribe((data: any) => {
          // select the new profile
          this.selectProfile(new Profile(data));
          // reset the account's password so we have a known value
          if (this.configuration.hasRequiredScopes(Functionality.Password)) {
            this.resetPassword();
          }
        },
        this.handleError
    );
    return o;
  }

  resetPassword(newPassword?: string, currentPassword?: string): Observable<any> {
    var data: any = {
      schemas: [ URN_PREFIX + 'scim:api:messages:2.0:PasswordUpdateRequest' ]
    };
    if (newPassword) {
      data.newPassword = newPassword;
    }
    if (currentPassword) {
      data.currentPassword = currentPassword;
    }
    var o = this.httpWrapper.put(this.getAccountUrl('password'), JSON.stringify(data));
    o.subscribe((data: any) => {
          if (data.generatedPassword) {
            this.alertService.add('This user\'s password was set to "' + data.generatedPassword + '".',
                AlertType.Info, true); // sticky alert
          }
        },
        (err: any) => {
          var error: any;
          // provide a friendly error message if the error is due to incorrect current password provided
          if (currentPassword && err.status === 401) {
            error = HttpWrapper.parseResponse(err);
            if (error && error.detail && error.detail.indexOf('invalid credentials') !== -1) {
              err = 'The current password is incorrect.';
            }
          }
          return this.handleError(err);
        });
    return o;
  }

  toggleAccountDisabled(disable: boolean): Observable<any> {
    var data: any = {
      accountDisabled: disable
    };
    var o = this.httpWrapper.put(this.getAccountUrl('account'), JSON.stringify(data));
    o.subscribe(() => this.fetchAccountState(),
        this.handleError);
    return o;
  }

  removeExternalIdentity(externalIdentity: any): Observable<any> {
    var o = this.httpWrapper.delete(this.getLocation(externalIdentity));
    o.subscribe(
        () => {
          var identities: any[] = this.externalIdentities.getValue();
          var identity: any = identities.find((ei: any) => ei.id === externalIdentity.id);
          identity.providerUserId = null;
          this.externalIdentities.next(identities);
        },
        this.handleError
    );
    return o;
  }

  removeSession(session: any): Observable<any> {
    return this.removeSubjectEntry(this.sessions, session);
  }

  removeConsent(consent: any): Observable<any> {
    return this.removeSubjectEntry(this.consents, consent);
  }

  toggleSecondFactorEnable(enable: boolean): Observable<any> {
    var profile = Utility.clone(this.profile.getValue());
    profile.record.secondFactorEnabled = enable;

    return this.updateProfile(profile);
  }

  getDefaultProviderIconUrl(provider: any): string {
    if (provider.iconUrl) {
      return provider.iconUrl;
    }
    switch (provider.type) {
      case 'facebook':
        return 'dist/img/facebook_32.png';
      case 'google':
        return 'dist/img/google_32.png';
      case 'oidc':
        return 'dist/img/openid_32.png';
    }
    return 'dist/img/generic-app.png';
  }

  private removeSubjectEntry(subject: BehaviorSubject<any[]>, obj: any): Observable<any> {
    var o = this.httpWrapper.delete(this.getLocation(obj));
    o.subscribe(
        () => {
          var objects = subject.getValue();
          objects.splice(objects.indexOf(obj), 1);
          subject.next(objects);
        },
        this.handleError
    );
    return o;
  }

  private getUrl(path: string): string {
    return this.httpWrapper.getResourceServerUrl('scim/v2/' + path);
  }

  private getAccountUrl(path: string = ''): string {
    var url: string;
    var profile = this.profile.getValue();
    if (profile) {
      url = this.getLocation(profile.record);
      if (path) {
        url += '/' + path;
      }
    }
    return url;
  }

  private processRecord(record: any): any {
    if (record && record.meta && record.meta.lastModified) {
      record.meta.lastModified = new Date(record.meta.lastModified);
    }
    return record;
  }

  private getLocation(record: any): string {
    return (record && record.meta) ? record.meta.location : undefined;
  }

  private formatError(error: any, details?: string): any {
    var obj: any = {}, message: string;

    // is it a response object?
    error = HttpWrapper.parseResponse(error);
    if (error instanceof ProgressEvent) {
      obj.message = 'Close the browser and reload the application. If you continue to see this error, an ' +
          'administrator should verify the Data Governance Broker CORS configuration.';
      obj.details = 'ProgressEvent';
    }
    else if (error.detail) {
      message = error.detail;
      if (error.scimType || error.status) {
        message += ' (';
        if (error.scimType) {
          message += error.scimType;
        }
        if (error.status) {
          if (error.scimType) {
            message += ', ';
          }
          message += error.status;
          obj.details = '' + error.status;
        }
        message += ')';
      }
      obj.message = message;
    }
    else {
      // otherwise should be string
      obj.message = typeof error === 'string' ? error : 'An error occurred.';
      if (details) {
        obj.details = details;
      }
    }

    return obj;
  }
}

// custom encoder that escapes '+' signs in values unlike the OOB QueryEncoder
class CustomQueryEncoder extends QueryEncoder {
  encodeKey(k: string): string {
    return super.encodeKey(k);
  }
  encodeValue(v: string): string {
    return super.encodeValue(v).replace(/\+/g, '%2B');
  }
}
