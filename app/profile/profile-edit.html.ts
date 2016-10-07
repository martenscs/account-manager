export const template = `
<h4 *ngIf="title">{{ title }}</h4>

<form *ngIf="active"
      (ngSubmit)="submit()"
      #profileForm="ngForm"
      novalidate>
  <div class="form-group">
    <label class="control-label">Username </label>
    <p *ngIf="! allowUsernameEdit"
       class="mbn">{{ profile.record.userName }}</p>
    <input *ngIf="allowUsernameEdit"
           [(ngModel)]="profile.record.userName"
           #userName="ngModel"
           name="userName"
           type="text" class="form-control input-sm" placeholder="Username Used for Sign in" required>
  </div>
  <div *ubidIfFunctionality="functionalityEnum.Entitlements"
       class="form-group">
    <label class="control-label">Entitlements </label>
    <div *ngFor="let entitlement of profile.record.entitlements; let i = index;"
         class="form-inline form-group">
      <input [(ngModel)]="profile.record.entitlements[i].value"
             [name]="'entitlements' + i"
             type="text" class="form-control input-sm" style="width:240px" placeholder="Enter value">
      <a (click)="removeEntitlement(i)"
         href="javascript:void(0)" class="mls">Remove</a>
    </div>
    <a (click)="addEntitlement()"
       href="javascript:void(0)"
       style="display: block">Add</a>
  </div>
  <div class="form-group">
    <label class="control-label required">Name </label>
    <div class="form-inline form-group">
      <div class="form-group">
        <input [(ngModel)]="profile.record.name.givenName"
               #givenName="ngModel"
               name="givenName"
               type="text" class="form-control input-sm" style="width:240px" placeholder="Given/First Name" required>
      </div>
      <div class="form-group">
        <input [(ngModel)]="profile.record.name.familyName"
               #familyName="ngModel"
               name="familyName"
               type="text" class="form-control input-sm" style="width:240px" placeholder="Last/Family Name" required>
      </div>
    </div>
    <div [hidden]="givenName.valid || givenName.pristine"
         class="validation-message ptn">
      Given/First Name is required.
    </div>
    <div [hidden]="(! givenName.valid && ! givenName.pristine) || familyName.valid || familyName.pristine"
         class="validation-message ptn">
      Last/Family Name is required.
    </div>
  </div>
  <div class="form-group">
    <label class="control-label required">Email </label>
    <!-- NOTE: the backslash characters in the pattern are double-escaped for the constant string -->
    <input [(ngModel)]="profile.email"
           #emailField="ngModel"
           required
           pattern="[^@\\s]+@[^@\\s]+\\.[^@\\s]+"
           name="email"
           type="email" class="form-control input-sm" placeholder="Email Address">
    <div [hidden]="emailField.valid || emailField.pristine"
         class="validation-message">
      <div [hidden]="! emailField.errors || ! emailField.errors.required">
        Email is required.
      </div>
      <div [hidden]="! emailField.errors || ! emailField.errors.pattern">
        Email is invalid.
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="control-label">Address </label>
    <input [(ngModel)]="profile.address.streetAddress"
           name="streetAddress"
           type="text" class="form-control input-sm" placeholder="Street Address">
  </div>
  <div class="form-inline form-group">
    <div class="form-group">
      <input [(ngModel)]="profile.address.locality"
             name="locality"
             type="text" class="form-control input-sm" style="width:300px" placeholder="City or Locality">
    </div>
    <div class="form-group">
      <input [(ngModel)]="profile.address.region"
             name="region"
             type="text" class="form-control input-sm" style="width:110px" placeholder="State or Region">
    </div>
    <div class="form-group">
      <input [(ngModel)]="profile.address.postalCode"
             name="postalCode"
             type="text" class="form-control input-sm" style="width:125px" placeholder="Zip or Postal Code">
    </div>
  </div>
  <div class="form-group">
    <label class="control-label">Phone </label>
    <input [(ngModel)]="profile.phone"
           name="phone"
           type="tel" class="form-control input-sm" placeholder="Phone Number">
  </div>
  <div class="form-group">
    <label class="control-label">Profile Image </label>
    <div class="row">
      <div class="col-md-2">
        <img [src]="profile.photoUrl || 'dist/img/placeholder-user.png'"
             alt="Profile Image" style="max-width:120px">
      </div>
      <div class="col-md-10" style="vertical-align:middle">
        <input [(ngModel)]="profile.photoUrl"
               name="photoUrl"
               type="text" class="form-control input-sm" placeholder="Profile Image URL">
      </div>
    </div>
  </div>
  <div style="margin-top:30px">
    <button [disabled]="! profileForm.form.valid"
            type="submit" class="btn btn-primary">Save</button>
    <a (click)="cancel()"
       href="javascript:void(0)"
       class="btn">Cancel</a>
  </div>
</form>
`;