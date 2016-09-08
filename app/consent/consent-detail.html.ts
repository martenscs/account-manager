export const template = `
<h3 class="mbm">Consent Details</h3>

<div class="row mtxl mhn">
  <div class="card clearfix">
    <img [src]="consent.client.iconUrl || 'dist/img/generic-app.png'"
         [alt]="consent.client.name"
         [title]="consent.client.name"
         class="pull-left mrm">
    <div class="pull-left">
      <div class="name">{{ consent.client.name }}</div>
      <div class="detail text-muted">{{ consent.client.description }}</div>
      <div>
        <a *ngIf="consent.client.emailAddress"
           [href]="'mailto:' + consent.client.emailAddress">Email</a>
        <span *ngIf="consent.client.emailAddress && consent.client.url"
              class="separator">|</span>
        <a *ngIf="consent.client.url"
           [href]="consent.client.url"
           target="_blank">Web</a>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-md-12">

    <p class="text-right">Last Modified:
      <strong>{{ consent.meta.lastModified | date:'medium' }}</strong>
    </p>

    <table class="table table-condensed table-bordered">
      <tbody>
      <tr>
        <th scope="col">Scope</th>
        <th scope="col">Description</th>
        <th scope="col">Consent</th>
      </tr>
      <tr *ngFor="let scope of consent.scopes">
        <td class="word-break">{{ scope.name }}</td>
        <td>{{ scope.consentPromptText }}</td>
        <td>{{ scope.consent | capitalize }}</td>
      </tr>
      </tbody>
    </table>

  </div>
</div>

<div class="mtm">
  <a [routerLink]="['/consent']"
     class="btn">Cancel</a>
  <div class="pull-right mtm"><a (click)="remove()"
                             href="javascript:void(0)"
                             style="color:#799ad3">Remove...</a></div>
</div>

<!-- NOTE: the backslash character is double-escaped for the constant string -->
<ubid-confirm
    [action]="'Remove Consent'"
    [prompt]="'If you continue, the application\\'s consent will be removed from this page and it will no longer be able
        to access this user\\'s information. To grant access to the application again, this user will have to do so from
        the application itself.'"
    [show]="showConfirm"
    (closed)="removeConfirmClosed($event)">
</ubid-confirm>
`;