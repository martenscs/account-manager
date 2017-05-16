/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'ubid-no-selection',
  template: `
    <div class="row">
      <div class="col-md-12">
        <p class="text-center no-results">
          No user account selected
        </p>
      </div>
    </div>
  `
})
export class NoSelectionComponent {

  constructor() {}
}
