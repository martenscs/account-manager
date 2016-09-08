/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScimService, Profile } from '../shared/index'

@Component({
  selector: 'ubid-profile-raw',
  template: `
    <h3 class="mbm">Raw Data</h3>
    <pre style="max-height: 450px;">{{ (profile || {}).record | json }}</pre>
    <a [routerLink]="['/profile']" class="btn">Cancel</a>
  `
})
export class RawComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  profile: Profile;

  constructor(private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => this.profile = profile);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}