/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Utility, ScimService } from '../shared/index'
import { PasswordRequirementsComponent } from './password-requirements.component';
import { template } from './change-password.html';

@Component({
  selector: 'ubid-change-password',
  template: template
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('currentPassword') currentPassword: FormControl;
  @ViewChild('newPassword') newPassword: FormControl;
  @ViewChild(PasswordRequirementsComponent) passwordRequirementsComponent: PasswordRequirementsComponent;

  currentPasswordRequired: boolean;
  passwordRequirements: any;

  changePasswordForm: FormGroup;

  constructor(private builder: FormBuilder, private router: Router, private scimService: ScimService) {}

  ngOnInit() {
    // use this user's password quality requirements
    this.scimService.passwordQualityRequirements$
        .subscribe((data: any) => {
          this.currentPasswordRequired = data.currentPasswordRequired;
          this.passwordRequirements = Utility.clone(data.passwordRequirements);
          // set up the validation
          var config: any = {
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
          };
          if (this.currentPasswordRequired) {
            config.currentPassword = ['', Validators.required];
          }
          this.changePasswordForm = <FormGroup> this.builder.group(
              config,
              { validator: this.validateForm() }
          );
        });
  }

  ngAfterViewInit() {
    Utility.focus(this.currentPassword || this.newPassword);
  }

  validateForm() {
    return (group: FormGroup): {[key: string]: any} => {
      var errors: any;
      if (group.controls['newPassword'].value !== group.controls['confirmPassword'].value) {
        errors = {
          mustMatch: true
        };
      }
      if (this.passwordRequirementsComponent &&
          ! this.passwordRequirementsComponent.satisfiesRequirements(group.controls['newPassword'])) {
        errors = errors || {};
        errors.requirements = true;
      }
      return errors;
    }
  }

  submit(value: any) {
    // on success, go back to view (error handled by service)
    this.scimService.changePassword(value.newPassword, value.currentPassword)
        .subscribe(
            () => this.router.navigate(['/profile']),
            () => {}
        );
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}