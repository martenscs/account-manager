/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { Injectable } from '@angular/core';


@Injectable()
export class Utility {

  static getRandomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // TODO: use a better approach
  static clone(obj: any) : any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  }

  // TODO: use a better approach
  static focus(field: any) {
    var nativeElement: any;

    // get a handle to the given field's native element
    if (field && field.nativeElement) {
      nativeElement = field.nativeElement;
    }
    else if (field && field.valueAccessor &&
        field.valueAccessor._elementRef &&
        field.valueAccessor._elementRef.nativeElement) {
      nativeElement = field.valueAccessor._elementRef.nativeElement;
    }

    if (nativeElement) {
      // use a timeout to make sure the document/element is ready
      setTimeout(() => nativeElement.focus(), 200);
    }
  }

  // TODO: workaround until NgForm has a reset method (https://github.com/angular/angular/issues/4933)
  static toggleActive(component: any) {
    component.active = false;
    setTimeout(() => component.active = true, 0);
  }
}