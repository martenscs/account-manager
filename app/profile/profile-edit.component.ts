/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Utility, ScimService, Profile } from '../shared/index'
import { template } from './profile-edit.html';

@Component({
  selector: 'ubid-account-profile-edit',
  template: template
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  profile: Profile;

  active = false;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          // create a copy of the profile for editing
          this.profile = Utility.clone(profile);
          
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
}