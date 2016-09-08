export const template = `
<div class="edit-list">
  <div class="row">
    <div class="col-md-12">

      <p class="text-muted">Below are the active sessions for browsers that accessed this user's account without signing
        out (up to five concurrently).</p>

    </div>
  </div>
  <div class="list">

    <div *ngFor="let session of sessions"
         class="row">
      <div class="list-row col-md-12">
        <div class="list-row-inner">

          <div class="pull-right"><a *ngIf="! session.currentSession"
                                     (click)="remove(session)" href="javascript:void(0)">Remove...</a></div>

          <div class="pap-app-info">
            <div class="pap-app-icon">
              <span [ngClass]="getStyles(session, true)"
                    [ngStyle]="getStyles(session)"
                    class="fa fa-3x"></span>
            </div>
            <div class="pap-app-text">
              <h4><span>{{ session.platform.name }} on {{ session.platform.os.family }}</span>
                <span *ngIf="session.currentSession"
                      class="text-muted">(current)</span></h4>
              <div class="pap-app-description text-muted">{{ session.ipAddress }}</div>
              <div class="pap-app-description text-muted">Last logged in {{ session.lastLogin | elapsedTime }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <h3 *ngIf="! sessions || sessions.length === 0"
        class="ptm">
      No sessions found.
    </h3>
  </div>
</div>

<ubid-confirm
    [action]="'Remove Session'"
    [prompt]="'If you continue, the session will be removed from this page and the affected browser will no longer be
        able to access this user\\'s information until they sign in again.'"
    [show]="showConfirm"
    (closed)="removeConfirmClosed($event)">
</ubid-confirm>
`;