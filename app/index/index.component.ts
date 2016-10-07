/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, Event, NavigationStart } from '@angular/router';

import { Configuration, ScimService, Profile, Functionality } from '../shared/index';
import { template } from './index.html';

@Component({
  selector: 'ubid-account-index',
  template: template
})
export class IndexComponent implements OnInit, OnDestroy  {
  // TODO: subscription and profile variables may be unnecessary if angular supports assigning expression
  // results to template local variables:
  //    https://github.com/angular/angular/issues/2451
  private profileSubscription: Subscription;
  private accountStateSubscription: Subscription;
  private routeSubscription: any;

  profile: Profile;
  accountState: any;

  searchFilter: string;
  showSearch = false;
  showActions = false;
  showConfirmDisable = false;

  functionalityEnum = Functionality;

  // configuration is used in the template...
  constructor(private router: Router, private configuration: Configuration, private scimService: ScimService) {}

  ngOnInit() {
    // watch for profile selection
    this.profileSubscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          var isChange = ! ( this.profile && this.profile.record && profile && profile.record &&
              this.profile.record.userName === profile.record.userName );
          this.profile = profile;
          if (profile && isChange) {
            this.router.navigate([ '/profile' ]);
          }
        });

    // update account state for disable/enable action
    this.accountStateSubscription = this.scimService.accountState$
        .subscribe((accountState: any) => this.accountState = accountState);

    // hide the actions on route change
    this.routeSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.showActions = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.accountStateSubscription) {
      this.accountStateSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  searchClosed(profile: Profile) {
    if (profile) {
      this.scimService.selectProfile(profile);
    }
    this.searchFilter = '';
    this.showSearch = false;
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

  refresh() {
    this.scimService.refreshProfile(true);
  }
}
