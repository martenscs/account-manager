/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Directive, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';

import { Configuration, Functionality } from './index';

@Directive({ selector: '[ubidIfFunctionality]' })
export class IfFunctionalityDirective {

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef,
              private configuration: Configuration) { }

  @Input() set ubidIfFunctionality(f: Functionality) {
    if (this.configuration.hasRequiredScopes(f)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainer.clear();
    }
  }
}