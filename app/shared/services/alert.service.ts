/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export enum AlertType { Info, Warning, Error }

export class Alert {
  constructor(public message: string, public type: AlertType = AlertType.Info, public sticky: boolean = false) {}

  getClass(): string {
    if (this.type === AlertType.Warning) {
      return 'alert-warning';
    }
    else if (this.type === AlertType.Error) {
      return 'alert-danger';
    }
    return 'alert-info'; // AlertType.Info ...
  }
}

@Injectable()
export class AlertService {
  private alerts: BehaviorSubject<Alert[]> = new BehaviorSubject([]);
  private _alerts$: Observable<Alert[]> = this.alerts.asObservable();

  constructor() {}

  get alerts$(): Observable<Alert[]> {
    return this._alerts$;
  }

  add(message: string, type: AlertType = AlertType.Error, sticky: boolean = false) {
    // NOTE: clear the alerts first, only ever have 1 currently...
    var alerts: Alert[] = [];
    alerts.push(new Alert(message, type, sticky));
    this.alerts.next(alerts);
  }

  close(alert: Alert) {
    var alerts = this.alerts.getValue();
    var index = alerts.indexOf(alert);
    if (index !== -1) {
      alerts.splice(index, 1);
      this.alerts.next(alerts);
    }
  }

  clear() {
    // clear any non-sticky alerts
    this.alerts.next(this.alerts.getValue().filter(a => a.sticky));
  }
}