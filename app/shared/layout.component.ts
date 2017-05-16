/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Configuration, AlertService, Alert, LoadingService, HttpWrapper } from './index';
import { template } from './layout.html';

@Component({
  selector: 'ubid-layout',
  template: template
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Input() title: string;

  alerts: Alert[];
  logoutUrl: string;
  isPingFederateIdp = false;
  showLoading = false;

  private alertSubscription: Subscription;
  private loadingSubscription: Subscription;

  // NOTE: Configuration instance is referenced by the template.
  constructor(private configuration: Configuration, private alertService: AlertService,
              private loadingService: LoadingService, private httpWrapper: HttpWrapper) {}

  ngOnInit() {
    this.logoutUrl = this.httpWrapper.getLogoutUrl();
    this.isPingFederateIdp = this.configuration.isPingFederateIdp;

    this.alertSubscription = this.alertService.alerts$.subscribe(
        (alerts: Alert[]) => this.alerts = alerts);

    this.loadingSubscription = this.loadingService.isLoading$.subscribe(
        (isLoading: boolean) => this.showLoading = isLoading);
  }

  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }

    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  closeAlert(alert: Alert) {
    this.alertService.close(alert);
  }

  revokeAndLogout() {
    this.httpWrapper.revokeAndLogout();
  }
}
