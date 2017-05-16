/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { template } from './password-requirements.html';

@Component({
  selector: 'ubid-password-requirements',
  template: template
})
export class PasswordRequirementsComponent {

  @Input() requirements: any;

  showRequirements = true;

  private lastValue: string;
  private lastResult: boolean;

  constructor() {}

  satisfiesRequirements(input: AbstractControl): boolean {
    // early out if no input or the value is pristine
    var password = input.value;
    var result = true;
    if (! this.requirements || this.requirements.length === 0 || (input.pristine && ! password)) {
      return true;
    }
    // early out if the value is the same as the last check
    else if (password === this.lastValue) {
      return this.lastResult;
    }

    // process the requirements...
    this.requirements.forEach((requirement: any) => {
      result = this.validate(password, requirement) && result;
    });

    // store the results for the next check
    this.lastValue = password;
    this.lastResult = result;

    return result;
  }

  validate(password: string, requirement: any): boolean {
    switch (requirement.type) {
      case 'length':
        requirement.satisfied = PasswordRequirementsComponent.validateLength(password,
            this.toNum(requirement.minPasswordLength), this.toNum(requirement.maxPasswordLength));
        break;
      case 'uniqueCharacters':
        requirement.satisfied = PasswordRequirementsComponent.validateUniqueCharacters(password,
            this.toNum(requirement.minUniqueCharacters), this.toBool(requirement.caseSensitiveValidation));
        break;
      case 'repeatedCharacters':
        requirement.satisfied = PasswordRequirementsComponent.validateRepeatedCharacters(password,
            this.toNum(requirement.maxConsecutiveLength), this.toBool(requirement.caseSensitiveValidation),
            requirement.characterSets);
        break;
      case 'characterSet':
        requirement.satisfied = PasswordRequirementsComponent.validateCharacterSet(password,
            this.toBool(requirement.allowUnclassifiedCharacters), requirement.characterSets);
        break;
      default:
        // we ignore any we don't support client-side validation for...
        return true;
    }

    return requirement.satisfied;
  }

  private toNum(value: string): number {
    return +value;
  }

  private toBool(value: string): boolean {
    return '' + value === 'true';
  }

  static validateLength(password: string, min: number, max: number): boolean {
    var length = password ? password.length : 0;

    return ( ! min || length >= min ) && ( ! max || length <= max );
  }

  static validateUniqueCharacters(password: string, min: number, caseSensitive: boolean): boolean {
    var i: number;
    var check: string;
    var unique = '';

    if (password) {
      for (i = 0; i < password.length; i++) {
        check = password[i];
        check = caseSensitive ? check : check.toLowerCase();
        if (unique.indexOf(check) === -1){
          unique += check;
        }
      }
    }

    return ( ! min || unique.length >= min );
  }

  static validateRepeatedCharacters(password: string, max: number, caseSensitive: boolean, sets: string[]): boolean {
    var i: number, check: string, last: string, count = 0;

    sets = sets || [];

    if (! password) {
      // early out
      return undefined;
    }

    if (! caseSensitive) {
      password = password.toLowerCase();
      sets = sets.map(s => s.toLowerCase());
    }

    for (i = 0; i < password.length; i++) {
      check = password[i];
      // characters can't be in more than one set, but don't have to be in a set
      var find = sets.find(s => s.indexOf(check) !== -1);
      if (find) {
        check = find;
      }
      if (check === last) {
        count++;
      }
      else {
        last = check;
        count = 1;
      }
      if (count > max) {
        return false;
      }
    }

    return true;
  }

  static validateCharacterSet(password: string, allowUnclassified: boolean, sets: any[]): boolean {
    var i: number, check: string, found: boolean;

    sets = sets || [];

    if (sets.length === 0) {
      return undefined;
    }
    else if (! password) {
      return false;
    }

    // create a copy of the array so we don't increment count every check
    sets = sets.map(s => Object.assign({}, s));

    // check each character of the password
    for (i = 0; i < password.length; i++) {
      check = password[i];
      found = false;
      sets.forEach(s => {
        if (s.characters.indexOf(check) !== -1) {
          (<any> s).count = ((<any> s).count || 0) + 1;
          found = true;
        }
      });
      if (! found && ! allowUnclassified) {
        return false;
      }
    }
    for (i = 0; i < sets.length; i++) {
      if ((sets[i].count || 0) < sets[i]['minCount']) {
        return false;
      }
    }
    return true;
  }

  getContainerClass(requirement: any) {
    if (requirement.satisfied === undefined) {
      return 'req-unknown';
    }
    else if (requirement.satisfied === true) {
      return 'req-ok';
    }
    else if (requirement.satisfied === false) {
      return 'req-missing';
    }
  }

  getIconClass(requirement: any) {
    if (requirement.satisfied === undefined) {
      return 'glyphicon-question-sign';
    }
    else if (requirement.satisfied === true) {
      return 'glyphicon-ok-sign';
    }
    else if (requirement.satisfied === false) {
      return 'glyphicon-remove-sign';
    }
  }
}
