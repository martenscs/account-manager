/**
 * Copyright 2016-2017 Ping Identity Corporation
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
            // validate the granted scopes in the JWT token
            grantedScopes = [];
            parts = params['access_token'].split('.');
            if (parts.length === 3) {
                jsonToken = JSON.parse(atob(parts[1]));
                if (jsonToken && jsonToken.scope) {
                    grantedScopes = jsonToken.scope;
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


  get criticalError$(): Observable<any> {
    return this._criticalError$;
  }

  selectProfile(profile: Profile, clearCache = true) {
    if (clearCache) {
      this.profile.next(undefined);
      this.accountState.next(undefined);
    }
    if (profile) {
      this.profile.next(profile);
      if (clearCache) {
        // also, pre-fetch the account state so we have it up front if they disable the account
        this.fetchAccountState();
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
        'name.formatted ' + indexedOperation + ' "' + filter + '" or ';

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
        },
        this.handleError
    );
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
