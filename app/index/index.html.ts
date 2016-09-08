export const template = `
  <div class="row toolbar">
    <div class="col-xs-6">
      <form (submit)="showSearch = true">
        <div class="input-group input-group-sm">
          <input [(ngModel)]="searchFilter"
                 name="searchFilter"
                 type="text" class="form-control"
                 placeholder="Search by username, full name, email or phone"
                 title="Search by username, full name, email or phone">
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
    
    <div *ubidIfFunctionality="functionalityEnum.Register"
         class="col-xs-2 text-right actions">
      <a [routerLink]="['/register']">Register New Account</a>
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
`;