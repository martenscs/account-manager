/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ScimService } from '../shared/index'
import { template } from './session-list.html';

@Component({
  selector: 'ubid-account-session-list',
  template: template
})
export class SessionListComponent implements OnInit, OnDestroy  {
  sessions: any[];
  showConfirm = false;

  private subscription: Subscription;

  private removeSession: any;

  constructor(private scimService: ScimService) {}

  ngOnInit() {
    this.subscription = this.scimService.sessions$
        .subscribe((data: any) => this.sessions = data);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  remove(session: any) {
    this.removeSession = session;
    this.showConfirm = true;
  }

  removeConfirmClosed(confirm: boolean) {
    if (confirm) {
      this.scimService.removeSession(this.removeSession)
          .subscribe(() => {}, () => {});
    }
    this.showConfirm = false;
  }

  getStyles(session: any, isClass: boolean): any {
    var styles: any = {};
    var className = '';

    var os: string;
    if (session && session.platform && session.platform.os) {
      os = session.platform.os.family;
    }

    if (/(OS X|iOS)/i.test(os)) {
      styles['color'] = '#a5adb0';
      className = 'fa-apple';
    }
    else if (/Windows/i.test(os)) {
      styles['color'] = '#70c0f0';
      className = 'fa-windows';
    }
    else if (/(Ubuntu|Debian|Fedora|Red Hat|SuSE)/i.test(os)) {
      styles['color'] = '#404040';
      className = 'fa-linux';
    }
    else if (/Android/i.test(os)) {
      styles['color'] = '#db3236';
      className = 'fa-google';
    }

    if (isClass) {
      return className;
    }
    return styles;
  }
}
