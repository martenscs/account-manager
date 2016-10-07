export const template = `
  <div class="row toolbar">
    <div class="col-xs-6">
      <form (submit)="showSearch = true">
        <div class="input-group input-group-sm">
          <input [(ngModel)]="searchFilter"
                 name="searchFilter"
                 type="text" class="form-control"
                 placeholder="Search by name, username, email or phone"
                 title="Search by name, username, email or phone">
          <span class="input-group-btn">
            <button type="submit" class="btn btn-primary">
              <span class="glyphicon glyphicon-search"></span>
            </button>
          </span>
        </div>
      </form>
    </div>
    
    <div class="col-xs-4 text-center">
      <div *ngIf="profile"
            class="selection">Account:
        <strong>{{ profile.fullName }}</strong></div>
    </div>
    
    <div *ngIf="profile || configuration.hasRequiredScopes(functionalityEnum.Register)"
         class="col-xs-2 text-right actions">
      
      <div [ngClass]="{ 'open' : showActions }"
           class="btn-group open">
        <a (click)="showActions = ! showActions"
           class="dropdown-toggle"
           href="javascript:void(0)">
          <span class="glyphicon glyphicon-cog"></span>
          <span>Actions</span>
          <b class="caret"></b>
        </a>
        <ul (click)="showActions = false"
            class="dropdown-menu dropdown-menu-right">
          <li *ubidIfFunctionality="functionalityEnum.Register">
            <a [routerLink]="['/register']">Register New Account</a>
          </li>
          <li *ngIf="profile && accountState && configuration.hasRequiredScopes(functionalityEnum.Account)">
            <a (click)="toggleDisabled()"
               href="javascript:void(0)">
               <span *ngIf="accountState.accountDisabled">Enable</span>
               <span *ngIf="! accountState.accountDisabled">Disable</span>
               Account</a>
          </li>
          <li *ngIf="profile && configuration.hasRequiredScopes(functionalityEnum.Password)">
            <a [routerLink]="['/profile/reset-password']">Reset Password</a>
          </li>
          <li *ngIf="profile">
                <a (click)="refresh()"
                   href="javascript:void(0)">Refresh Account</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <ul *ngIf="profile"
      class="nav nav-tabs mtm mbxl">
    <li [routerLinkActive]="['active']"
        role="presentation"><a [routerLink]="['/profile']" 
                               href="javascript:void(0)">Profile</a></li>    
    <li *ubidIfFunctionality="functionalityEnum.SecondFactor"
        [routerLinkActive]="['active']"
        role="presentation"><a [routerLink]="['/second-factor']"
                               href="javascript:void(0)">Second Factor</a></li>
    <li *ubidIfFunctionality="functionalityEnum.ExternalIdentities"
        [routerLinkActive]="['active']"
        role="presentation"><a [routerLink]="['/external-identity']"
                               href="javascript:void(0)">Linked Accounts</a></li>
    <li *ubidIfFunctionality="functionalityEnum.Sessions"
        [routerLinkActive]="['active']"
        role="presentation"><a [routerLink]="['/session']" 
                               href="javascript:void(0)">Sessions</a></li>
    <li *ubidIfFunctionality="functionalityEnum.Consents"
        [routerLinkActive]="['active']"
        role="presentation"><a [routerLink]="['/consent']"
                               href="javascript:void(0)">Consent</a></li>
    <li [routerLinkActive]="['active']"
        role="presentation"><a [routerLink]="['/preference']"
                               href="javascript:void(0)">Preferences</a></li>
  </ul>
        
  <router-outlet></router-outlet>
  
  <ubid-search
      [filter]="searchFilter"
      [show]="showSearch"
      (closed)="searchClosed($event)">
  </ubid-search>
  
  <ubid-confirm
    [action]="'Disable Account'"
    [prompt]="'If you continue, this user will no longer be able to sign in with this account.'"
    [show]="showConfirmDisable"
    (closed)="disableConfirmClosed($event)">
  </ubid-confirm>
`;