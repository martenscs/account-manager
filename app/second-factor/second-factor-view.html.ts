export const template = `
<div class="row">
  <div class="list-row col-md-12">
    <p class="text-muted">
      When second factor authentication is enabled, sign-in may require both password and an additional authentication
      method.
    </p>
  </div>
</div>

<div class="row mts">
  <div class="list-row col-md-12">
    <div *ngIf="secondFactorEnabled"
         class="pull-right">
      <a (click)="toggleEnable(false)"
         href="javascript:void(0)">Disable...</a>
    </div>
    <p class="text-muted">This feature is currently
       <strong *ngIf="secondFactorEnabled">Enabled</strong><!--
       --><strong *ngIf="! secondFactorEnabled">Disabled</strong><!--
       -->.
      <span *ngIf="! secondFactorEnabled && ! verificationMethodConfigured">
        This user will have to configure an authentication method before enabling it.
      </span>
    </p>
    <button *ngIf="! secondFactorEnabled"
            [disabled]="! verificationMethodConfigured"
            (click)="toggleEnable(true)"
            type="button" class="btn btn-primary mbl">Enable</button>
  </div>
</div>

<div class="row">
  <div class="list-row col-md-12 section-header">
    <h4 class="section-header">Authentication Methods</h4>
    <p class="text-muted">These methods can be used to perform second factor authentication.</p>
  </div>
</div>

<div class="row">
  <div class="list-row col-md-12">
    <div class="list-row-inner">
      <div class="pull-right">
        <span *ngIf="! emailConfigured"
              class="text-muted">Not Configured</span>
      </div>
      <div class="pap-app-info">
        <div class="pap-app-icon">
          <span class="fa fa-envelope fa-2x" style="color: #F47B20"></span>
        </div>
        <div class="pap-app-text">
          <h4 [ngStyle]="{ 'margin-top': emailConfigured ? '0' : '5px' }">
            <span>Email Code</span>
          </h4>
          <div *ngIf="emailConfigured"
               class="pap-app-description">{{ validatedEmailAddress.attributeValue }}</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="list-row col-md-12">
    <div class="list-row-inner">
      <div class="pull-right">
        <span *ngIf="! telephonyConfigured"
              class="text-muted">Not Configured</span>
      </div>
      <div class="pap-app-info">
        <div class="pap-app-icon">
          <span class="fa fa-mobile fa-3x" style="color: #2274A5;"></span>
        </div>
        <div class="pap-app-text">
          <h4 [ngStyle]="{ 'margin-top': telephonyConfigured ? '0' : '10px' }">
            <span>Phone Code</span>
          </h4>
          <div *ngIf="telephonyConfigured"
               class="pap-app-description">{{ validatedPhoneNumber.attributeValue }}
            <span *ngIf="validatedPhoneNumber.messagingProvider === messagingProviders.SMS"
                  class="text-muted">(Text)</span>
            <span *ngIf="validatedPhoneNumber.messagingProvider === messagingProviders.VOICE"
                  class="text-muted">(Voice)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="list-row col-md-12">
    <div class="list-row-inner">
      <div class="pull-right">
        <span *ngIf="! totpConfigured"
              class="text-muted">Not Configured</span>
      </div>
      <div class="pap-app-info">
        <div class="pap-app-icon">
          <span class="fa fa-clock-o fa-2x" style="color:#1F2D4C"></span>
        </div>
        <div class="pap-app-text">
          <h4 [ngStyle]="{ 'margin-top': totpConfigured ? '0' : '4px' }">Time-based One-time Password</h4>
          <div *ngIf="totpConfigured"
               class="pap-app-description">Registered
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<ubid-confirm
    [action]="'Disable Second Factor'"
    [prompt]="'If you continue, this user will no longer be able to use second factor with this account.'"
    [show]="showConfirmDisable"
    (closed)="disableConfirmClosed($event)">
</ubid-confirm>
`;