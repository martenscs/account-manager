/**
 * Copyright 2016-2017 Ping Identity Corporation
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
  private routeSubscription: any;

  profile: Profile;

  searchFilter: string;
  showSearch = false;
  showActions = false;

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

  refresh() {
    this.scimService.refreshProfile(true);
  }
}
