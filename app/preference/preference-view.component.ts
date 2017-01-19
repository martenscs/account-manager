/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScimService, Profile } from '../shared/index'
import { template } from './preference-view.html';

@Component({
  selector: 'ubid-account-preference-view',
  template: template
})
export class PreferenceViewComponent implements OnInit, OnDestroy  {
  private subscription: Subscription;

  hasCommunicationContentOptions: boolean;
  selectedTopicPreferences: any[];

  constructor(private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.profile$
        .subscribe((profile: Profile) => {
          if (profile) {
            var options = profile.communicationContentOptions;
            this.hasCommunicationContentOptions = (this.isOptIn(options.sms) ||
                this.isOptIn(options.email)) && (this.isOptIn(options.coupon) ||
                this.isOptIn(options.newsletter) || this.isOptIn(options.notification));
            this.selectedTopicPreferences = (profile.topicPreferences || [])
                .filter((preference: any) => preference.strength > 0);
          }
          else {
            this.hasCommunicationContentOptions = false;
            this.selectedTopicPreferences = [];
          }
        });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // determine whether or not the given opt is an "opt in"
  isOptIn(opt: any): boolean {
    return opt && opt.polarityOpt === 'in';
  }
}
