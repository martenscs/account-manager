/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScimService } from '../shared/index';
import { template } from './error.html';

@Component({
  selector: 'ubid-error',
  template: template
})
export class ErrorComponent implements OnInit {
  message: string;
  details: string;
  
  constructor(private route: ActivatedRoute, private scimService: ScimService) {}

  ngOnInit() {
    this.message = this.route.snapshot.params['message'] ||
        (this.scimService.error ? this.scimService.error.message : undefined);
    this.details = this.route.snapshot.params['details'] ||
        (this.scimService.error ? this.scimService.error.details : undefined);

    if (this.details === 'access_denied') {
      this.details = this.message + ' (' + this.details + ')';
      this.message = 'The application was not granted the required scopes.  Make sure you are signing in with a ' +
          'privileged account.';
    }
  }
}
