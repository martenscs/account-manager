/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';

import { AlertService, ScimService } from './shared/index';

@Component({
  selector: 'ubid-app',
  template: `
      <ubid-layout [hidden]="! show" [title]="'Account Manager'">
        <router-outlet></router-outlet>
      </ubid-layout>
    `
})
export class AppComponent implements OnInit, OnDestroy {

  private window: Window;
  private routeSubscription: any;
  private errorSubscription: any;

  show: boolean;

  constructor(@Inject(Window) window: Window, private router: Router, private alertService: AlertService,
              private scimService: ScimService) {
    this.window = window;
  }
  
  ngOnInit() {
    // clear the alerts on route change
    this.routeSubscription = this.router.events.subscribe((event:Event) => {
      // don't clear alerts on the initial navigation events - the only alerts present then are generated during
      // initialization...
      if (event instanceof NavigationStart && (! event.id || event.id > 2)) {
        this.alertService.clear();
      }
    });

    // route to error on critical error
    this.errorSubscription = this.scimService.criticalError$.subscribe((err: any) => {
      if (err) {
        this.router.navigate([ '/error' ])
      }
    });

    // navigate to the appropriate initial view
    var route = '/';
    if (this.scimService.error) {
      route = '/error';
    }
    // HACK: the router has not yet loaded its initial route at this point, so any navigation call here will get
    // cancelled by the initial route which uses the location from the URL.  To workaround we set the hash to the
    // desired initial route.
    //this.router.navigate([ route ]);
    if (this.window && this.window.location) {
      this.window.location.hash = route;
    }

    // only show the layout/page if the SCIM service initialized (i.e. did not redirect for access token)
    this.show = this.scimService.initialized;
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }
}