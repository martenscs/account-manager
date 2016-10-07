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
      <div *ngIf="entitlements && entitlements.length > 0"
           class="form-group">
        <label class="col-sm-2 control-label">Entitlements</label>
        <div class="col-sm-10">
          <p class="form-control-static">{{ entitlements.join(', ') }}</p>
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
    <a [routerLink]="['/profile/edit']">Edit Profile</a>
    <span class="separator">|</span>
    <a [routerLink]="['/profile/raw']">View Raw Data</a>
  </div>
</div>
`;