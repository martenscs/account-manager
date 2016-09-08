/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScimService, MESSAGING_PROVIDERS } from '../shared/index'
import { template } from './second-factor-view.html';


@Component({
  selector: 'ubid-account-second-factor-view',
  template: template
})
export class SecondFactorViewComponent implements OnInit, OnDestroy  {

  private profileSubscription: Subscription;
  private validatedEmailAddressSubscription: Subscription;
  private validatedPhoneNumberSubscription: Subscription;
  private totpSharedSecretSubscription: Subscription;

  profile: any;
  validatedEmailAddress: any;
  validatedPhoneNumber: any;
  totpSharedSecret: any;

  messagingProviders = MESSAGING_PROVIDERS;

  showConfirmDisable = false;

  constructor(private scimService: ScimService) {}

  ngOnInit() {
    this.profileSubscription = this.scimService.profile$
        .subscribe((data: any) => this.profile = data);
    this.validatedEmailAddressSubscription = this.scimService.validatedEmailAddress$
        .subscribe((data: any) => this.validatedEmailAddress = data);
    this.validatedPhoneNumberSubscription = this.scimService.validatedPhoneNumber$
        .subscribe((data: any) => this.validatedPhoneNumber = data);
    this.totpSharedSecretSubscription = this.scimService.totpSharedSecret$
        .subscribe((data: any) => this.totpSharedSecret = data);
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.validatedEmailAddressSubscription) {
      this.validatedEmailAddressSubscription.unsubscribe();
    }
    if (this.validatedPhoneNumberSubscription) {
      this.validatedPhoneNumberSubscription.unsubscribe();
    }
    if (this.totpSharedSecretSubscription) {
      this.totpSharedSecretSubscription.unsubscribe();
    }
  }

  toggleEnable(enable: boolean) {
    if (enable) {
      this.scimService.toggleSecondFactorEnable(true);
    }
    else {
      this.showConfirmDisable = true;
    }
  }

  disableConfirmClosed(confirm: boolean) {
    if (confirm) {
      this.scimService.toggleSecondFactorEnable(false);
    }
    this.showConfirmDisable = false;
  }

  get secondFactorEnabled(): boolean {
    return this.profile && this.profile.record && this.profile.record.secondFactorEnabled;
  }

  get verificationMethodConfigured(): boolean {
    return this.emailConfigured || this.telephonyConfigured || this.totpConfigured;
  }

  get emailConfigured(): boolean {
    return this.validatedEmailAddress && this.validatedEmailAddress.attributeValue &&
        this.validatedEmailAddress.validated;
  }

  get telephonyConfigured(): boolean {
    return this.validatedPhoneNumber && this.validatedPhoneNumber.attributeValue && this.validatedPhoneNumber.validated;
  }

  get totpConfigured(): boolean {
    return this.totpSharedSecret && this.totpSharedSecret.registered;
  }
}
