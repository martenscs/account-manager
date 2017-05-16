/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {

  transform(value: any) : any {
    if (value && typeof value === 'string') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

}
