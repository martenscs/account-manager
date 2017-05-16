/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Utility, ScimService } from '../shared/index'
import { PasswordRequirementsComponent } from './password-requirements.component';
import { template } from './reset-password.html';

@Component({
  selector: 'ubid-reset-password',
  template: template
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('currentPassword') currentPassword: FormControl;
  @ViewChild('newPassword') newPassword: FormControl;
  @ViewChild(PasswordRequirementsComponent) passwordRequirementsComponent: PasswordRequirementsComponent;

  currentPasswordRequired: boolean;
  passwordRequirements: any;

  resetPasswordForm: FormGroup;

  constructor(private builder: FormBuilder, private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    // use this user's password quality requirements
    this.scimService.passwordQualityRequirements$
        .subscribe((data: any) => {
          if (data) {
            this.currentPasswordRequired = data.currentPasswordRequired;
            this.passwordRequirements = Utility.clone(data.passwordRequirements);
            // set up the validation
            var config: any = {
              autoGeneratePassword: [true, Validators.nullValidator],
              newPassword: ['', Validators.nullValidator],
              confirmPassword: ['', Validators.nullValidator]
            };
            if (this.currentPasswordRequired) {
              config.currentPassword = ['', Validators.required];
            }
            this.resetPasswordForm = <FormGroup> this.builder.group(
                config,
                { validator: this.validateForm() }
            );
          }
        });
  }

  ngAfterViewInit() {
    Utility.focus(this.currentPassword || this.newPassword);
  }

  validateForm() {
    return (group: FormGroup): {[key: string]: any} => {
      var errors: any = {};
      var newPassword = group.controls['newPassword'].value;
      var confirmPassword = group.controls['confirmPassword'].value;
      // only validate new/confirm password if not auto-generating
      if (! group.controls['autoGeneratePassword'].value) {
        if (! newPassword) {
          errors.newPasswordRequired = true;
        }
        if (! confirmPassword) {
          errors.confirmPasswordRequired = true;
        }
        if (newPassword !== confirmPassword) {
          errors.mustMatch = true;
        }
        if (this.passwordRequirementsComponent &&
            ! this.passwordRequirementsComponent.satisfiesRequirements(group.controls['newPassword'])) {
          errors.requirements = true;
        }
      }
      return errors;
    }
  }

  submit(value: any) {
    // on success, go back to view (error handled by service)
    var newPassword: string = value.autoGeneratePassword ? undefined : value.newPassword;
    this.scimService.resetPassword(newPassword, value.currentPassword)
        .subscribe(
            () => this.router.navigate(['/profile']),
            () => {}
        );
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}