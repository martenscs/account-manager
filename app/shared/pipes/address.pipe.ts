/**
* Copyright 2016-2018 Ping Identity Corporation
* All Rights Reserved.
*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {

  transform(value: any) : any {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    var output = '';
    output += this.format(value.streetAddress, output);
    output += this.format(value.locality, output);
    output += this.format(value.region, output);
    output += this.format(value.postalCode, output);
    return output;
  }

  private format(input: string, output: string) : string {
    var append = '';
    if (input) {
      if (output) {
        append += ', ';
      }
      append += input;
    }
    return append;
  }
}
