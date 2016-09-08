export const template = `
<h3 class="mbm">Update Interests</h3>

<p class="text-muted">This user will receive customized messages for the topics selected below.</p>

<form *ngIf="active"
      (ngSubmit)="submit()"
      novalidate=""
      class="mtl">
  <div *ngFor="let preference of topicPreferences"
       class="form-group">
    <div class="checkbox">
      <label>
        <input #cb
               [checked]="preference.strength === 10"
               (change)="preference.strength = cb.checked ? 10 : -10"
               type="checkbox"> {{ preference.label }}
      </label>
    </div>
  </div>
  <div class="mtxl">
    <button class="btn btn-primary" type="submit">Save</button>

    <a [routerLink]="['/preference']"
       class="btn">Cancel</a>
  </div>
</form>
`;