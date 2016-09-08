/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScimService, Profile, Functionality } from '../shared/index';
import { template } from './profile-view.html';

@Component({
  selector: 'ubid-account-profile-view',
  template: template
})
export class ProfileViewComponent implements OnInit, OnDestroy  {

  // TODO: subscription and profile variables may be unnecessary if angular supports assigning expression
  // results to template local variables:
  //    https://github.com/angular/angular/issues/2451
  private profileSubscription: Subscription;
  private accountStateSubscription: Subscription;

  profile: Profile;
  accountState: any;

  showConfirmReset = false;
  showConfirmDisable = false;

  functionalityEnum = Functionality;

  constructor(private scimService: ScimService) {}

  ngOnInit() {
    this.profileSubscription = this.scimService.profile$
        .subscribe((profile: Profile) => this.profile = profile);

    this.accountStateSubscription = this.scimService.accountState$
        .subscribe((accountState: any) => this.accountState = accountState);
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.accountStateSubscription) {
      this.accountStateSubscription.unsubscribe();
    }
  }

  reset() {
    this.showConfirmReset = true;
  }

  resetConfirmClosed(confirm: boolean) {
    if (confirm) {
      // no arguments == reset
      this.scimService.changePassword();
    }
    this.showConfirmReset = false;
  }

  toggleDisabled() {
    if (this.accountState.accountDisabled) {
      this.scimService.toggleAccountDisabled(false);
    }
    else {
      this.showConfirmDisable = true;
    }
  }

  disableConfirmClosed(confirm: boolean) {
    if (confirm) {
      this.scimService.toggleAccountDisabled(true);
    }
    this.showConfirmDisable = false;
  }
}
