/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Configuration, ScimService, Profile, Functionality } from '../shared/index';
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
  entitlements: string[];

  constructor(private configuration: Configuration, private scimService: ScimService) {}

  ngOnInit() {
    this.profileSubscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          this.profile = profile;
          if (this.configuration.hasRequiredScopes(Functionality.Entitlements)) {
            this.entitlements = Profile.getEntitlementValues(profile);
          }
        });

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
}
