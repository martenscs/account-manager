export const template = `
<form [formGroup]="changePasswordForm"
      (ngSubmit)="changePasswordForm.valid && submit(changePasswordForm.value)"
      autocomplete="off"
      novalidate>

  <h3 class="mbm">Change Password</h3>

  <div *ngIf="currentPasswordRequired"
       [ngClass]="{ 'has-error': changePasswordForm.controls['currentPassword'].dirty &&
          changePasswordForm.controls['currentPassword'].hasError('required') }"
       class="form-group">
    <label class="control-label required">Current&nbsp;Password </label>
    <input formControlName="currentPassword"
           type="password" placeholder="Enter Current Password" class="form-control input-sm" tabindex="1">
    <div *ngIf="changePasswordForm.controls['currentPassword'].dirty && 
                  changePasswordForm.controls['currentPassword'].hasError('required')"
         class="validation-message">
      Current Password is required.
    </div>
  </div>
  <div [ngClass]="{ 'has-error': changePasswordForm.controls['newPassword'].dirty &&
          (changePasswordForm.controls['newPassword'].hasError('required') ||
          changePasswordForm.hasError('requirements')) }"
       class="form-group">
    <label class="control-label required">New Password </label>
    <input formControlName="newPassword"
           type="password" required placeholder="Enter New Password" class="form-control input-sm" tabindex="2">
    <div *ngIf="changePasswordForm.controls['newPassword'].dirty && 
                  changePasswordForm.controls['newPassword'].hasError('required')"
         class="validation-message">
      New Password is required.
    </div>
    <ubid-password-requirements [requirements]="passwordRequirements"></ubid-password-requirements>
  </div>
  <div [ngClass]="{ 'has-error': changePasswordForm.controls['confirmPassword'].dirty &&
          (changePasswordForm.controls['confirmPassword'].hasError('required') ||
          changePasswordForm.hasError('mustMatch')) }"
       class="form-group">
    <label class="control-label required">Confirm&nbsp;Password </label>
    <input formControlName="confirmPassword"
           type="password" required placeholder="Re-enter New Password" class="form-control input-sm" tabindex="3">
    <div *ngIf="changePasswordForm.controls['confirmPassword'].dirty && 
                  (changePasswordForm.controls['confirmPassword'].hasError('required') ||
            changePasswordForm.hasError('mustMatch'))"
         class="validation-message">
      <span *ngIf="changePasswordForm.controls['confirmPassword'].hasError('required')">Confirm Password is required.</span>
      <span *ngIf="changePasswordForm.hasError('mustMatch') &&
                ! changePasswordForm.controls['confirmPassword'].hasError('required')">Confirm Password must match New Password.</span>
    </div>
  </div>
  <div class="form-group mtxl mbn">
    <input [disabled]="! changePasswordForm.valid"
           type="submit" class="btn btn-primary" value="Change Password" tabindex="4">
    <button (click)="cancel()"
            type="button" class="btn" tabindex="5">Cancel</button>
  </div>
</form>
`;