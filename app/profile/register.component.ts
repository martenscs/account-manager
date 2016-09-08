/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Utility, ScimService, Profile } from '../shared/index'
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
}