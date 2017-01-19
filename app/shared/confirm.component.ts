/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { template } from './confirm.html';

@Component({
  selector: 'ubid-confirm',
  template: template
})
export class ConfirmComponent {

  @Input() action: string;
  @Input() prompt: string;
  private _show: boolean;
  @Output() closed = new EventEmitter<boolean>();

  constructor() {}

  @Input()
  set show(show: boolean) {
    this._show = show;
  }

  get show() {
    return this._show;
  }

  confirm() {
    this.closed.emit(true);
  }

  cancel() {
    this.closed.emit(false);
  }
}
