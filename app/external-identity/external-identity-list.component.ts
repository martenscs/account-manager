/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScimService } from '../shared/index'
import { template } from './external-identity-list.html';

@Component({
  selector: 'ubid-account-external-identity-list',
  template: template
})
export class ExternalIdentityListComponent implements OnInit, OnDestroy  {
  externalIdentities: any[];
  showConfirm = false;

  private subscription: Subscription;

  private removeExternalIdentity: any;

  constructor(private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.externalIdentities$
        .subscribe((data: any) => this.externalIdentities = data);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  remove(externalIdentity: any) {
    this.removeExternalIdentity = externalIdentity;
    this.showConfirm = true;
  }

  removeConfirmClosed(confirm: boolean) {
    if (confirm) {
      this.scimService.removeExternalIdentity(this.removeExternalIdentity)
          .subscribe(() => {}, () => {});
    }
    this.showConfirm = false;
  }

  getProviderIconUrl(provider: any): string {
    return this.scimService.getDefaultProviderIconUrl(provider);
  }
}
