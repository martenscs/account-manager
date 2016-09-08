/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ScimService } from '../shared/index'
import { template } from './consent-list.html';

@Component({
  selector: 'ubid-account-consent-list',
  template: template
})
export class ConsentListComponent implements OnInit, OnDestroy  {
  consents: any[];
  showConfirm = false;

  private subscription: Subscription;

  private removeConsent: any;

  constructor(private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.consents$
        .subscribe((data: any) => this.consents = data);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  remove(consent: any) {
    this.removeConsent = consent;
    this.showConfirm = true;
  }

  removeConfirmClosed(confirm: boolean) {
    if (confirm) {
      this.scimService.removeConsent(this.removeConsent)
          .subscribe(() => {}, () => {});
    }
    this.showConfirm = false;
  }

  viewDetail(consent: any) {
    this.router.navigate(['/consent', consent.id]);
  }
}
