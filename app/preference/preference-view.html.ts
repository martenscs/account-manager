export const template = `
<div class="row">
  <div class="col-md-12">

    <p class="text-muted">Users can choose how we communicate with them and the topics that interest them.</p>

    <div class="mtl">

      <h3 class="mbm">Promotional Message Choices</h3>

      <p *ngIf="! hasCommunicationContentOptions"
         class="text-muted">
        This user has not chosen to receive promotional messages from us.
      </p>

      <p *ngIf="hasCommunicationContentOptions"
         class="text-muted">
        This user has chosen to receive promotional messages from us.
      </p>

      <div class="mtm">
        <a [routerLink]="['/preference/communication-content']">Change Choices</a>
      </div>

    </div>

    <div class="mtl">

      <h3 class="mbm">Interests</h3>

      <div *ngIf="selectedTopicPreferences && selectedTopicPreferences.length">
        <p class="text-muted">
          This user added the following interest<span *ngIf="selectedTopicPreferences.length > 1">s</span>:
        </p>
        <div class="well well-sm">
          <ul class="mbn">
            <li *ngFor="let preference of selectedTopicPreferences">{{ preference.label }}</li>
          </ul>
        </div>
      </div>

      <p *ngIf="selectedTopicPreferences && ! selectedTopicPreferences.length"
         class="text-muted">
        This user has not added any interests.
      </p>

      <div class="mtm">
        <a [routerLink]="['/preference/topic']">Update Interests</a>
      </div>

    </div>

  </div>
</div>
`;