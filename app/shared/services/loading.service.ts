/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoadingService {
  private keys: string[] = [];
  private keyCounts: any = {};
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoading$: Observable<boolean> = this.isLoading.asObservable();

  constructor() {}

  get isLoading$(): Observable<boolean> {
    return this._isLoading$;
  }

  start(key: string) {
    if (this.keys.indexOf(key) === -1) {
      this.keys.push(key);
      this.keyCounts[key] = 1;
      this.updateIsLoading();
    }
    else {
      this.keyCounts[key]++;
    }
  }

  stop(key: string) {
    var index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keyCounts[key]--;
      if (this.keyCounts[key] <= 0) {
        this.keys.splice(index, 1);
        this.updateIsLoading();
      }
    }
  }

  private updateIsLoading() {
    this.isLoading.next(this.keys.length > 0);
  }
}