export const template = `
<div class="edit-list">
  <div class="row">
    <div class="col-md-12">
      <p class="text-muted">Users can link their social media accounts for more personalized offers and the ability to
        log in with their social account's username and password.</p>
    </div>
  </div>
  <div class="list">

    <div *ngFor="let identity of externalIdentities"
         class="row">
      <div class="list-row col-md-12">
        <div class="list-row-inner">

          <div *ngIf="identity.providerUserId"
               class="pull-right">
            <strong>Account Linked</strong>
            <span class="separator"> | </span>
            <a (click)="remove(identity)" href="javascript:void(0)">Unlink...</a>
          </div>

          <div *ngIf="! identity.providerUserId"
               class="pull-right">
            Not Linked
          </div>

          <div class="pap-app-info">

            <div class="pap-app-icon">
              <img [src]="getProviderIconUrl(identity.provider)"
                   [alt]="identity.provider.name"
                   [title]="identity.provider.name"
                   style="max-width:64px">
            </div>

            <div class="pap-app-text">
              <h4>{{ identity.provider.name }}</h4>
              <div class="pap-app-description text-muted">{{ identity.provider.description }}</div>
            </div>

          </div>

        </div>
      </div>
    </div>

  </div>

  <h3 *ngIf="! externalIdentities || externalIdentities.length === 0"
      class="ptm">
    No external identity providers found.
  </h3>

</div>

<ubid-confirm
    [action]="'Remove Link'"
    [prompt]="'If you continue, this user will no longer be able to use the linked account to sign in.'"
    [show]="showConfirm"
    (closed)="removeConfirmClosed($event)">
</ubid-confirm>
`;