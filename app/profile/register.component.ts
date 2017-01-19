/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Utility, ScimService, Profile, Functionality } from '../shared/index'
import { template } from './profile-edit.html';

@Component({
  selector: 'ubid-account-register',
  template: template
})
export class RegisterComponent implements OnInit {

  profile: Profile;

  title = 'Register New Account';
  allowUsernameEdit = true;

  active = false;

  functionalityEnum = Functionality;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    // clear profile selection
    this.scimService.selectProfile(undefined);

    // create an empty profile for editing
    this.profile = new Profile({ name: {} });
    Utility.toggleActive(this);
  }

  submit() {
    // on success, go to view (error handled by service)
    this.scimService.createProfile(this.profile)
        .subscribe(
            () => this.router.navigate(['/profile']),
            () => {}
        );
  }

  cancel() {
    this.router.navigate(['/']);
  }

  addEntitlement() {
    this.profile.record = this.profile.record || {};
    this.profile.record.entitlements = this.profile.record.entitlements || [];
    this.profile.record.entitlements.push({ value: '' });
  }

  removeEntitlement(index: number) {
    this.profile.record.entitlements.splice(index, 1);
  }
}