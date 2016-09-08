/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ScimService, Profile, Functionality } from '../shared/index';
import { template } from './index.html';

@Component({
  selector: 'ubid-account-index',
  template: template
})
export class IndexComponent implements OnInit, OnDestroy  {
  // TODO: subscription and profile variables may be unnecessary if angular supports assigning expression
  // results to template local variables:
  //    https://github.com/angular/angular/issues/2451
  private subscription: Subscription;

  profile: Profile;

  searchFilter: string;
  showSearch = false;

  functionalityEnum = Functionality;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    // watch for profile selection
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          var isChange = ! ( this.profile && this.profile.record && profile && profile.record &&
              this.profile.record.userName === profile.record.userName );
          this.profile = profile;
          if (profile && isChange) {
            this.router.navigate([ '/profile' ]);
          }
        });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  searchClosed(profile: Profile) {
    if (profile) {
      this.scimService.selectProfile(profile);
    }
    this.searchFilter = '';
    this.showSearch = false;
  }
}
