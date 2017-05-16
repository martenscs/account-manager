export const template = `
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <div class="login-div">
        <div class="login-header">
          <div class="pull-right"><img class="logo" src="dist/img/ping-identity-horizontal-logo.png" alt="Ping Identity Logo"></div>
          <div class="title">{{ title }}</div>
        </div>
        <div class="alerts-panel">
          <div *ngFor="let alert of alerts"
               [ngClass]="alert.getClass()"
               class="alert fade in">
            <button (click)="closeAlert(alert)"
                    class="close">X</button>
            <div class="message">{{ alert.message }}</div>
          </div>
        </div>
        <div class="login-container">

          <ng-content></ng-content>

        </div>
        <div class="login-footer">
          <div class="footer-contents">
            <a *ngIf="! isPingFederateIdp"
               [href]="logoutUrl">Sign Out</a>
            <a *ngIf="isPingFederateIdp"
               (click)="revokeAndLogout()"
               href="javascript:void(0)">Sign Out</a>
            <span class="separator">|</span>
            <a (click)="showAbout = true"
               href="javascript:void(0)">Powered by Ping Identity Data Governance Broker</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div [style.display]="showAbout ? 'block' : 'none'"
     class="modal fade in ab">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header" style="border:none">
        <button (click)="showAbout = false"
                type="button" class="close">x</button>
      </div>
      <div class="modal-body ab-body">
        <div class="ab-app-logo">
          <img src="dist/img/ping-identity-square-logo.png" alt="Ping Identity Logo">
        </div>
        <div class="ab-app-name">Data Governance Broker Account Manager Sample UI</div>
        <div class="ab-app-version"> {{ configuration.version }}</div>
        <div class="ab-contact-info"> Ping Identity Corporation
          <br> 1001 17th Street
          <br> Suite 100
          <br> Denver, CO 80202
          <br> +1 303 468 2900</div>
        <div><a class="ab-email-info" href="https://www.pingidentity.com" target="_blank">https://www.pingidentity.com</a></div>
      </div>
    </div>
  </div>
</div>
<div *ngIf="showAbout"
     class="modal-backdrop fade in"></div>

<div *ngIf="showLoading"
     class="loading-overlay">
  <span class="fa fa-spinner fa-pulse loading-icon"></span>
</div>
`;
