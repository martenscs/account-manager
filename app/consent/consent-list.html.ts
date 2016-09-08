export const template = `
<div class="edit-list">
  <div class="row">
    <div class="col-md-12">

      <p class="text-muted">The applications listed below have access to this user's profile information.
        You can view what information is being shared or prevent information sharing by removing consent
        for the application.</p>

    </div>
  </div>
  <div class="list">

    <div *ngFor="let consent of consents"
         class="row">
      <div class="list-row col-md-12">
        <div class="list-row-inner">

          <div class="pull-right">
            <a (click)="viewDetail(consent)"
               href="javascript:void(0)">Details</a>

            <span class="separator"> | </span>

            <a (click)="remove(consent)"
               href="javascript:void(0)">Remove...</a>
          </div>

          <div class="pap-app-info">

            <div class="pap-app-icon">
              <img [src]="consent.client.iconUrl || 'dist/img/generic-app.png'"
                   [alt]="consent.client.name"
                   [title]="consent.client.name"
                   style="max-width:64px">
            </div>

            <div class="pap-app-text">
              <h4>
                <span>{{ consent.client.name }}</span>
              </h4>
              <div class="pap-app-description text-muted">{{ consent.client.description }}</div>
              <div *ngIf="consent.client.emailAddress || consent.client.url"
                   class="pap-app-description">
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
      </div>
    </div>

    <h3 *ngIf="! consents || consents.length === 0"
        class="ptm">
      No consents found.
    </h3>

  </div>
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