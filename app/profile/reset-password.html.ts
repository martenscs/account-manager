export const template = `
<form [formGroup]="resetPasswordForm"
      (ngSubmit)="resetPasswordForm.valid && submit(resetPasswordForm.value)"
      autocomplete="off"
      novalidate>

  <h3 class="mbm">Reset Password</h3>

  <div *ngIf="currentPasswordRequired"
       [ngClass]="{ 'has-error': resetPasswordForm.controls['currentPassword'].dirty &&
          resetPasswordForm.controls['currentPassword'].hasError('required') }"
       class="form-group">
    <label class="control-label required">Current&nbsp;Password </label>
    <input formControlName="currentPassword"
           type="password" placeholder="Enter Current Password" class="form-control input-sm" tabindex="1">
    <div *ngIf="resetPasswordForm.controls['currentPassword'].dirty && 
                  resetPasswordForm.controls['currentPassword'].hasError('required')"
         class="validation-message">
      Current Password is required.
    </div>
  </div>
  <div class="form-group mtl">
    <div class="checkbox">
      <label class="control-label">
        <input formControlName="autoGeneratePassword"
               type="checkbox"
               tabindex="2"
               style="margin-top:4px"> Auto-generate the New Password
      </label>
    </div>
  </div>
  <div *ngIf="! resetPasswordForm.controls['autoGeneratePassword'].value"
       [ngClass]="{ 'has-error': resetPasswordForm.controls['newPassword'].dirty &&
          (resetPasswordForm.hasError('newPasswordRequired') ||
          resetPasswordForm.hasError('requirements')) }"
       class="form-group">
    <label class="control-label required">New Password </label>
    <input formControlName="newPassword"
           type="password" placeholder="Enter New Password" class="form-control input-sm" tabindex="3">
    <div *ngIf="resetPasswordForm.controls['newPassword'].dirty && 
                  resetPasswordForm.hasError('newPasswordRequired')"
         class="validation-message">
      New Password is required.
    </div>
    <ubid-password-requirements [requirements]="passwordRequirements"></ubid-password-requirements>
  </div>
  <div *ngIf="! resetPasswordForm.controls['autoGeneratePassword'].value"
       [ngClass]="{ 'has-error': resetPasswordForm.controls['confirmPassword'].dirty &&
          (resetPasswordForm.hasError('confirmPasswordRequired') ||
          resetPasswordForm.hasError('mustMatch')) }"
       class="form-group">
    <label class="control-label required">Confirm&nbsp;Password </label>
    <input formControlName="confirmPassword"
           type="password" placeholder="Re-enter New Password" class="form-control input-sm" tabindex="4">
    <div *ngIf="resetPasswordForm.controls['confirmPassword'].dirty && 
                  (resetPasswordForm.hasError('confirmPasswordRequired') ||
            resetPasswordForm.hasError('mustMatch'))"
         class="validation-message">
      <span *ngIf="resetPasswordForm.hasError('confirmPasswordRequired')">Confirm Password is required.</span>
      <span *ngIf="resetPasswordForm.hasError('mustMatch') &&
                ! resetPasswordForm.hasError('confirmPasswordRequired')">Confirm Password must match New Password.</span>
    </div>
  </div>
  <div class="form-group mtxl mbn">
    <input [disabled]="! resetPasswordForm.valid"
           type="submit" class="btn btn-primary" value="Reset Password" tabindex="5">
    <button (click)="cancel()"
            type="button" class="btn" tabindex="5">Cancel</button>
  </div>
</form>
`;