/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ScimService } from '../shared/index'
import { template } from './consent-detail.html';

@Component({
  selector: 'ubid-account-consent-detail',
  template: template
})
export class ConsentDetailComponent implements OnInit {
  consent: any;
  showConfirm = false;

  constructor(private router: Router, private route: ActivatedRoute, private scimService: ScimService) { }

  ngOnInit() {
    var id: string = this.route.snapshot.params['id'];

    this.scimService.consents$
        .subscribe(
          (data: any) => this.consent = data.find((consent: any) => consent.id === id),
          () => {})
        .unsubscribe();
  }

  remove() {
    this.showConfirm = true;
  }

  removeConfirmClosed(confirm: boolean) {
    if (confirm) {
      this.scimService.removeConsent(this.consent)
          .subscribe(
            () => this.router.navigate(['/consent']),
            () => {}
          );
    }
    this.showConfirm = false;
  }
}