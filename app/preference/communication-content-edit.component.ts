/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Utility, ScimService, Profile } from '../shared/index'
import { template } from './communication-content-edit.html';

@Component({
  selector: 'ubid-account-preference-communication-content-edit',
  template: template
})
export class CommunicationContentEditComponent implements OnInit, OnDestroy  {

  private subscription: Subscription;

  profile: Profile;
  options: any;

  active = false;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          this.profile = Utility.clone(profile);
          // for convenience when binding, set a reference to the options
          if (this.profile) {
            this.options = this.profile.communicationContentOptions;
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
    this.scimService.updateProfile(this.profile, true) // updateCommunicationContentOptions
        .subscribe(
        () => this.router.navigate(['/preference']),
        () => {}
    );
  }
}