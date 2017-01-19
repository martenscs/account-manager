/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Utility, ScimService, Profile, Functionality } from '../shared/index'
import { template } from './profile-edit.html';

@Component({
  selector: 'ubid-account-profile-edit',
  template: template
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  profile: Profile;

  active = false;

  functionalityEnum = Functionality;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          // create a copy of the profile for editing
          this.profile = Utility.clone(profile);
          if (this.profile && this.profile.record && this.profile.record.entitlements) {
            this.profile.record.entitlements.sort((a: any, b:any) => a.value.localeCompare(b.value));
          }

          Utility.toggleActive(this);
        });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  submit() {
    // on success, go back to view (error handled by service)
    this.scimService.updateProfile(this.profile)
        .subscribe(
            () => this.router.navigate(['/profile']),
            () => {}
        );
  }

  cancel() {
    this.router.navigate(['/profile']);
  }

  addEntitlement() {
    this.profile.record.entitlements = this.profile.record.entitlements || [];
    this.profile.record.entitlements.push({ value: '' });
  }

  removeEntitlement(index: number) {
    this.profile.record.entitlements.splice(index, 1);
  }
}