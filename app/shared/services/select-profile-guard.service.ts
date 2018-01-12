/**
 * Copyright 2016-2018 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { ScimService } from './index';


@Injectable()
export class SelectProfileGuard implements CanActivate {

  constructor(private router: Router, private scimService: ScimService) {}

  canActivate() {
    // only let the route be activated if there is currently a profile selected
    if (this.scimService.isProfileSelected) {
      return true;
    }

    // otherwise, navigate to the index page with no selection
    this.router.navigate([ '/' ]);
    return false;
  }
}
