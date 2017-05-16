/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'elapsedTime' })
export class ElapsedTimePipe implements PipeTransform {

  public static second: number = 1000;
  public static minute: number = 60 * ElapsedTimePipe.second;
  public static hour: number = 60 * ElapsedTimePipe.minute;
  public static day: number = 24 * ElapsedTimePipe.hour;
  public static week: number = 7 * ElapsedTimePipe.day;
  public static month: number = 4 * ElapsedTimePipe.week; // fudged
  public static year: number = 52 * ElapsedTimePipe.week;

  transform(value: any) : any {
    var elapsedMs: number, output = '';

    if (typeof value === 'string') {
      value = new Date(value);
    }
    else if (typeof value !== 'object' || value === null) {
      return value;
    }

    elapsedMs = Date.now() - value.getTime();

    ['year','month','week','day','hour','minute','second'].forEach(function(unit) {
      var result: number;
      if (! output) {
        result = Math.floor(elapsedMs / ElapsedTimePipe[unit]);
        if (result > 0) {
          output = '' + result + ' ' + unit + (result > 1 ? 's' : '') + ' ago';
        }
      }
    });

    return output || 'now';
  }
}