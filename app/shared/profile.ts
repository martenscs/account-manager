/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Utility, URN_PREFIX } from './index'

// constants for the default schemas
const SCHEMA: any = {
  CORE: URN_PREFIX + 'schemas:User:1.0',
  EXTENSION: URN_PREFIX + 'schemas:sample:profile:1.0'
};

const X_VALUE_URN_PREFIX = 'urn:X-pingidentity:';

const COMMUNICATION_OPT: any = {
  SMS: X_VALUE_URN_PREFIX + 'Opt:SMSMarketing',
  EMAIL: X_VALUE_URN_PREFIX + 'Opt:EmailMarketing'
};

const CONTENT_OPT: any = {
  COUPON: X_VALUE_URN_PREFIX + 'Opt:Coupons',
  NEWSLETTER: X_VALUE_URN_PREFIX + 'Opt:Newsletters',
  NOTIFICATION: X_VALUE_URN_PREFIX + 'Opt:Notification'
};

const COLLECTOR: string = X_VALUE_URN_PREFIX + ':App:account-manager';

const TOPICS = {};
TOPICS[X_VALUE_URN_PREFIX + 'topic:clothing:shoes'] = 'I love shoes';
TOPICS[X_VALUE_URN_PREFIX + 'topic:clothing:workout'] = 'I like to workout';
TOPICS[X_VALUE_URN_PREFIX + 'topic:clothing:casual'] = 'I\'m comfortably casual';
TOPICS[X_VALUE_URN_PREFIX + 'topic:clothing:accessories'] = 'I love to accessorize';
TOPICS[X_VALUE_URN_PREFIX + 'topic:clothing:impress'] = 'I dress to impress';


// This class encapsulates a profile record (contains schema-specific dependencies).
export class Profile {
  record: any;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  address: any;
  photoUrl: string;
  communicationContentOptions: any;
  topicPreferences: any;

  constructor(record: any) {
    this.record = record;

    // populate schema-specific convenience fields for binding
    this.userName = record.userName;
    this.fullName = Profile.buildFullName(record);
    this.email = (Profile.findValueOfType(record, 'emails', 'home') || {}).value;
    this.phone = (Profile.findValueOfType(record, 'phoneNumbers', 'mobile') || {}).value;
    this.address = Profile.findValueOfType(record, 'addresses', 'home') || {};
    this.photoUrl = record.photoURLs && record.photoURLs.length > 0 ? record.photoURLs[0] : undefined;
    this.communicationContentOptions = Profile.buildCommunicationContentOptions(record);
    this.topicPreferences = Profile.buildTopicPreferences(record);
  }

  static toScim(profile: Profile,
                updateCommunicationContentOptions = false,
                updateTopicPreferences = false): any {
    var record = Utility.clone(profile.record);

    // ensure the record's schema list includes the required schemas
    record.schemas = record.schemas || [];
    if (record.schemas.indexOf(SCHEMA.CORE) === -1) {
      record.schemas.push(SCHEMA.CORE);
    }
    if (record.schemas.indexOf(SCHEMA.EXTENSION) === -1) {
      record.schemas.push(SCHEMA.EXTENSION);
    }

    // populate the multi-valued properties appropriately
    Profile.findValueOfType(record, 'emails', 'home', true).value = profile.email;

    if (profile.phone) {
      Profile.findValueOfType(record, 'phoneNumbers', 'mobile', true).value = profile.phone;
    }
    else {
      Profile.removeValueOfType(record.phoneNumbers, 'mobile');
    }

    var address = profile.address;
    if (address.streetAddress || address.locality || address.region || address.postalCode) {
      Object.assign(Profile.findValueOfType(record, 'addresses', 'home', true), address);
    }
    else {
      Profile.removeValueOfType(record.addresses, 'home');
    }

    if (profile.photoUrl) {
      record.photoURLs = record.photoURLs || [];
      if (record.photoURLs.length > 0) {
        record.photoURLs[0] = profile.photoUrl;
      }
      else {
        record.photoURLs.push(profile.photoUrl);
      }
    }
    else {
      if (record.photoURLs && record.photoURLs.length > 0) {
        record.photoURLs.splice(0, 1);
      }
    }

    // update the communication and content options appropriately
    if (updateCommunicationContentOptions) {
      Profile.storeCommunicationContentOptions(record, profile.communicationContentOptions);
    }

    // update the topic preferences appropriately
    if (updateTopicPreferences) {
      Profile.storeTopicPreferences(record, profile.topicPreferences);
    }

    // filter out any empty entitlements
    if (record.entitlements) {
      record.entitlements = record.entitlements
          .map((v: any) => ({ value: v.value.trim() }))
          .filter((v: any) => !! v.value);
    }

    return record;
  }

  static getLocation(profile: Profile): string {
    return profile.record && profile.record.meta ?
        profile.record.meta.location :
        undefined;
  }

  static updateFullName(profile: Profile) {
    if (profile && profile.record && profile.record.name) {
      profile.record.name.formatted = Profile.buildFullName(profile.record);
    }
  }

  static getEntitlementValues(profile: Profile) {
    return profile && profile.record && profile.record.entitlements ?
        profile.record.entitlements.map((j: any) => j.value).sort((a: string, b: string) => a.localeCompare(b)) :
        undefined;
  }

  private static buildFullName(record: any): string {
    var output = '';
    if (record) {
      if (record.name) {
        if (record.name.givenName) {
          output += record.name.givenName;
        }
        if (record.name.familyName) {
          if (output) {
            output += ' ';
          }
          output += record.name.familyName;
        }
        if (!output && record.name.formatted) {
          output = record.name.formatted;
        }
      }
      if (!output && record.displayName) {
        output = record.displayName;
      }
    }
    return output;
  }

  private static buildCommunicationContentOptions(record: any): any {
    var sms: any, email: any, frequencyValues: string[], frequency = 'weekly', day = 'Friday', time = '12:00',
        coupon: any, newsletter: any, notification: any;
    var extension = record[SCHEMA.EXTENSION] || {};
    var communicationOpts = extension.communicationOpts = ( extension.communicationOpts || [] );
    var contentOpts = extension.contentOpts = ( extension.contentOpts || [] );

    // process the communication options, populating them with default values if necessary
    sms = Profile.cloneOrDefault(communicationOpts, COMMUNICATION_OPT.SMS, {
      id: COMMUNICATION_OPT.SMS,
      frequency: 'weekly;Friday',
      polarityOpt: 'out',
      destinationType: 'sms',
      destination: ( Profile.findValueOfType(record, 'phoneNumbers', 'mobile') || {} ).value
    });

    email = Profile.cloneOrDefault(communicationOpts, COMMUNICATION_OPT.EMAIL, {
      id: COMMUNICATION_OPT.EMAIL,
      frequency: 'weekly;Friday',
      polarityOpt: 'out',
      destinationType: 'email',
      destination: ( Profile.findValueOfType(record, 'emails', 'home') || {} ).value
    });

    frequencyValues = sms.frequency.split(';');
    if (frequencyValues.length === 2) {
      if (frequencyValues[0] === 'weekly') {
        frequency = frequencyValues[0];
        day = frequencyValues[1];
      }
      else if (frequencyValues[0] === 'daily') {
        frequency = frequencyValues[0];
        time = frequencyValues[1];
      }
    }

    // process the content options, populating them with default values if necessary
    coupon = Profile.cloneOrDefault(contentOpts, CONTENT_OPT.COUPON, {
      id: CONTENT_OPT.COUPON,
      polarityOpt: 'out'
    });
    newsletter = Profile.cloneOrDefault(contentOpts, CONTENT_OPT.NEWSLETTER, {
      id: CONTENT_OPT.NEWSLETTER,
      polarityOpt: 'out'
    });
    notification = Profile.cloneOrDefault(contentOpts, CONTENT_OPT.NOTIFICATION, {
      id: CONTENT_OPT.NOTIFICATION,
      polarityOpt: 'out'
    });

    // return a structure we can use for easily data-binding to the various options
    return {
      coupon: coupon,
      newsletter: newsletter,
      notification: notification,
      sms: sms,
      email: email,
      frequency: frequency,
      day: day,
      time: time
    };
  }

  private static buildTopicPreferences(record: any): any[] {
    var topicId: string, preference: any, result: any[] = [];
    var extension = record[SCHEMA.EXTENSION] || {};
    var topicPreferences = extension.topicPreferences || [];

    for (topicId in TOPICS) {
      if (! TOPICS.hasOwnProperty(topicId)) {
        continue;
      }
      preference = topicPreferences.find((t: any) => t.id === topicId);
      // create copy and convert strength to this app's supported values (-10 or 10)
      result.push({
        id: topicId,
        label: TOPICS[topicId],
        strength: preference && preference.strength > 0 ? 10 : -10
      });
    }

    return result;
  }

  private static storeCommunicationContentOptions(record: any, options: any): any {
    var extension: any, communicationOpts: any[], contentOpts: any[], newCommOpts: any[] = [], newContOpts: any[] = [],
        timeStamp: string, frequency: string;

    options = Utility.clone(options);
    extension = record[SCHEMA.EXTENSION] = ( record[SCHEMA.EXTENSION] || {} );
    communicationOpts = extension.communicationOpts = ( extension.communicationOpts || [] );
    contentOpts = extension.contentOpts = ( extension.contentOpts || [] );

    // add in any existing opt values that aren't the ones we are concerned with
    communicationOpts.forEach((opt: any) => {
      if (opt.id !== COMMUNICATION_OPT.SMS && opt.id !== COMMUNICATION_OPT.EMAIL) {
        newCommOpts.push(opt);
      }
    });
    contentOpts.forEach((opt: any) => {
      if (opt.id !== CONTENT_OPT.COUPON && opt.id !== CONTENT_OPT.NEWSLETTER && opt.id !== CONTENT_OPT.NOTIFICATION) {
        newContOpts.push(opt);
      }
    });

    // add in the updated values
    timeStamp = (new Date()).toISOString();
    frequency = options.frequency;
    if (frequency === 'weekly') {
      frequency += ';' + options.day;
    }
    else {
      frequency += ';' + options.time;
    }

    [ options.sms, options.email ].forEach((opt: any) => {
      opt.frequency = frequency;
      opt.collector = COLLECTOR;
      opt.timeStamp = timeStamp;
      newCommOpts.push(opt);
    });

    [ options.coupon, options.newsletter, options.notification ].forEach((opt: any) => {
      opt.collector = COLLECTOR;
      opt.timeStamp = timeStamp;
      newContOpts.push(opt);
    });

    // store the changes
    extension.communicationOpts = newCommOpts;
    extension.contentOpts = newContOpts;

    return record;
  }

  private static storeTopicPreferences(record: any, preferences: any[]): any {
    var extension: any, origTopicPreferences: any[], newPreferences: any[] = [], timeStamp: string;
    preferences = Utility.clone(preferences);
    extension = record[SCHEMA.EXTENSION] = ( record[SCHEMA.EXTENSION] || {} );
    origTopicPreferences = extension.topicPreferences = ( extension.topicPreferences || [] );

    // add in any existing preferences that aren't the ones we are concerned with
    origTopicPreferences.forEach((pref: any) => {
      var topicId: string, foundPref = false;
      for (topicId in TOPICS) {
        if (! TOPICS.hasOwnProperty(topicId)) {
          continue;
        }
        if (topicId === pref.id) {
          foundPref = true;
          break;
        }
      }
      if (! foundPref) {
        newPreferences.push(pref);
      }
    });

    // add in the updated values
    timeStamp = (new Date()).toISOString();
    preferences.forEach((pref: any) => {
      delete pref.label;
      pref.timeStamp = timeStamp;
      newPreferences.push(pref);
    });

    // store the changes
    extension.topicPreferences = newPreferences;

    return record;
  }

  private static findValueOfType(record: any, attribute: string, type: string, addIfMissing?: boolean): any {
    var values: any[] = record[attribute], value: any;
    if (! values) {
      if (! addIfMissing) {
        return undefined;
      }
      values = record[attribute] = [];
    }
    value = values.find((val: any) => val.type === type);
    if (addIfMissing && ! value) {
      value = { type: type };
      values.push(value);
    }
    return value;
  }

  private static removeValueOfType(values: any, type: string) {
    var index = (values || []).findIndex((val: any) => val.type === type);
    if (index >= 0) {
      values.splice(index, 1);
    }
  }

  private static cloneOrDefault(values: any[], id: string, defaultValue: any): any {
    var value = values.find((o: any) => o.id === id);
    if (value) {
      value = Utility.clone(value);
    }
    else {
      value = defaultValue;
    }
    return value;
  }
}