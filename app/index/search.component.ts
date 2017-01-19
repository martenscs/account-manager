/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ScimService, Profile } from '../shared/index';
import { template } from './search.html';

@Component({
  selector: 'ubid-search',
  template: template
})
export class SearchComponent {

  @Input() filter: string;
  private _show: boolean;
  @Output() closed = new EventEmitter<Profile>();

  users: any[];

  constructor(private scimService: ScimService) {}

  @Input()
  set show(show: boolean) {
    this._show = show;

    if (show) {
      this.search();
    }
  }

  get show() {
    return this._show;
  }

  search() {
    this.scimService.queryUsers(this.filter)
        .subscribe(
            (data: any) => {
              var users: Profile[] = [];
              if (data.Resources) {
                // create profiles
                data.Resources.forEach((resource: any) => users.push(new Profile(resource)));
                // sort by name
                users.sort((a: Profile, b: Profile) => a.fullName.localeCompare(b.fullName));
              }
              this.users = users;
            },
            () => this.cancel() // dismiss and let the index view handle/display the error alert
        );
  }

  select(user: Profile) {
    this.closed.emit(user);
    this.users = [];
  }

  cancel() {
    this.closed.emit(undefined);
    this.users = [];
  }
}
