/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { PasswordRequirementsComponent } from './password-requirements.component';

describe('PasswordRequirementsComponent Tests', () => {

  it('validateLength', () => {
    var fn = PasswordRequirementsComponent.validateLength;

    expect(fn(null, 5, NaN)).toBe(false);
    expect(fn('', 5, NaN)).toBe(false);
    expect(fn('abcde', 5, NaN)).toBe(true);
    expect(fn('abcdeghijk', 5, NaN)).toBe(true);

    expect(fn(null, NaN, 10)).toBe(true);
    expect(fn('', NaN, 10)).toBe(true);
    expect(fn('abcde', NaN, 10)).toBe(true);
    expect(fn('abcdeghijk', NaN, 10)).toBe(true);
    expect(fn('abcdeghijklmnop', NaN, 10)).toBe(false);

    expect(fn(null, 5, 10)).toBe(false);
    expect(fn('', 5, 10)).toBe(false);
    expect(fn('abcde', 5, 10)).toBe(true);
    expect(fn('abcdeghijk', 5, 10)).toBe(true);
    expect(fn('abcdeghijklmnop', 5, 10)).toBe(false);
  });

  it('validateUniqueCharacters', () => {
    var fn = PasswordRequirementsComponent.validateUniqueCharacters;

    expect(fn(null, 5, false)).toBe(false);
    expect(fn('', 5, false)).toBe(false);
    expect(fn('abcdd', 5, false)).toBe(false);
    expect(fn('abcdD', 5, false)).toBe(false);
    expect(fn('abcdD', 5, true)).toBe(true);
    expect(fn('abcde', 5, false)).toBe(true);
  });

  it('validateRepeatedCharacters', () => {
    var fn = PasswordRequirementsComponent.validateRepeatedCharacters;

    expect(fn(null, 2, false, [])).toBe(undefined);
    expect(fn('', 2, false, [])).toBe(undefined);
    expect(fn('abcde', 2, false, [])).toBe(true);
    expect(fn('aaade', 2, false, [])).toBe(false);
    expect(fn('abeee', 2, false, [])).toBe(false);

    expect(fn('aaade', 2, true, [])).toBe(false);
    expect(fn('aAade', 2, true, [])).toBe(true);
    expect(fn('abeee', 2, true, [])).toBe(false);
    expect(fn('abeEe', 2, true, [])).toBe(true);

    expect(fn(null, 2, false, ['abc', 'def'])).toBe(undefined);
    expect(fn('', 2, false, ['abc', 'def'])).toBe(undefined);
    expect(fn('abgde', 2, false, ['abc', 'def'])).toBe(true);
    expect(fn('abcde', 2, false, ['abc', 'def'])).toBe(false);
    expect(fn('aaade', 2, false, ['abc', 'def'])).toBe(false);
    expect(fn('abeee', 2, false, ['abc', 'def'])).toBe(false);

    expect(fn('aBbgdE', 2, true, ['aBc', 'dEf'])).toBe(true);
    expect(fn('aBcdE', 2, true, ['aBc', 'dEf'])).toBe(false);
    expect(fn('abcdEf', 2, true, ['aBc', 'dEf'])).toBe(false);
  });

  it('validateCharacterSet', () => {
    var fn = PasswordRequirementsComponent.validateCharacterSet;
    var defaultCharsets: any[] = [
      {
        characters: 'ZYXWVUTSRQPONMLKJIHGFEDCBA',
        minCount: 1
      },
      {
        characters: '~!@#$%^&*()-_=+[]{}|;:,.<>/?',
        minCount: 1
      },
      {
        characters: '0123456789',
        minCount: 1
      },
      {
        characters: 'abcdefghijklmnopqrstuvwxyz',
        minCount: 1
      }
    ];

    expect(fn(null, true, defaultCharsets)).toBe(false);
    expect(fn('', true, defaultCharsets)).toBe(false);
    expect(fn('Z~0', true, defaultCharsets)).toBe(false);
    expect(fn('Z~0a', true, defaultCharsets)).toBe(true);

    expect(fn('ca1', true, [{ characters: 'abc', minCount: 3 }])).toBe(false);
    expect(fn('cab123', true, [{ characters: 'abc', minCount: 3 }])).toBe(true);
    expect(fn('cab123', false, [{ characters: 'abc', minCount: 3 }])).toBe(false);
  });

});
