/**
 * Copyright 2016-2018 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Utility, ScimService, Profile } from '../shared/index'
import { template } from './topic-edit.html';

@Component({
  selector: 'ubid-account-preference-topic-edit',
  template: template
})
export class TopicEditComponent implements OnInit, OnDestroy  {

  private subscription: Subscription;

  profile: Profile;
  topicPreferences: any[];

  active = false;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          this.profile = Utility.clone(profile);
          // for convenience when binding, set a reference to the options
          if (this.profile) {
            this.topicPreferences = this.profile.topicPreferences;
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
    this.scimService.updateProfile(this.profile,
        false, // updateCommunicationContentOptions
        true) // updateTopicPreferences
        .subscribe(
          () => this.router.navigate(['/preference']),
          () => {}
        );
  }

}
