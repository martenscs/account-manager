export const template = `
<div *ngIf="profile"
     class="row">
  <div class="col-md-9">
    <form class="form-horizontal" role="form">
      <div class="form-group">
        <label class="col-sm-2 control-label">Name</label>
        <div class="col-sm-10">
          <p class="form-control-static">{{ profile.fullName }}
            <strong *ngIf="accountState && accountState.accountDisabled">(Account Disabled)</strong>
          </p>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">Username</label>
        <div class="col-sm-10">
          <p class="form-control-static">{{ profile.record.userName }}</p>
        </div>
      </div>
      <div *ngIf="profile.email"
           class="form-group">
        <label class="col-sm-2 control-label">Email</label>
        <div class="col-sm-10">
          <p class="form-control-static">{{ profile.email }}</p>
        </div>
      </div>
      <div *ngIf="profile.address?.type"
           class="form-group">
        <label class="col-sm-2 control-label">Address </label>
        <div class="col-sm-10">
          <p class="form-control-static">{{ profile.address | address }}</p>
        </div>
      </div>
      <div *ngIf="profile.phone"
           class="form-group">
        <label class="col-sm-2 control-label">Phone</label>
        <div class="col-sm-10">
          <p class="form-control-static">{{ profile.phone }}</p>
        </div>
      </div>
    </form>
  </div>
  <div class="col-md-3">
    <div class="profile-image">
      <img [src]="profile.photoUrl || 'dist/img/placeholder-user.png'"
           alt="user icon">
    </div>
  </div>

</div>

<div *ngIf="profile"
     class="mtm">
  <div class="pull-right">
    <a [routerLink]="['/profile/edit']">Edit</a>
    <span *ubidIfFunctionality="functionalityEnum.Account"
          class="separator">|</span>
    <a *ubidIfFunctionality="functionalityEnum.Account"
       (click)="toggleDisabled()"
       href="javascript:void(0)"><!--
       --><span *ngIf="accountState && accountState.accountDisabled">Enable</span><!--
       --><span *ngIf="accountState && (! accountState.accountDisabled)">Disable</span><!--
     --></a>
    <span *ubidIfFunctionality="functionalityEnum.Password"
          class="separator">|</span>
    <a *ubidIfFunctionality="functionalityEnum.Password"
       [routerLink]="['/profile/change-password']">Change Password</a>
    <span *ubidIfFunctionality="functionalityEnum.Password"
          class="separator">|</span>
    <a *ubidIfFunctionality="functionalityEnum.Password"
       (click)="reset()"
       href="javascript:void(0)">Reset Password</a>
    <span class="separator">|</span>
    <a [routerLink]="['/profile/raw']">Raw Data</a>
  </div>
</div>

<ubid-confirm
  [action]="'Reset Password'"
  [prompt]="'If you continue, this user will no longer be able to sign in with their current password.'"
  [show]="showConfirmReset"
  (closed)="resetConfirmClosed($event)">
</ubid-confirm>

<ubid-confirm
  [action]="'Disable Account'"
  [prompt]="'If you continue, this user will no longer be able to sign in with this account.'"
  [show]="showConfirmDisable"
  (closed)="disableConfirmClosed($event)">
</ubid-confirm>
`;