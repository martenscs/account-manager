export const template = `
<div [style.display]="show ? 'block' : 'none'"
     class="modal fade in">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button (click)="cancel()"
                type="button" class="close">x</button>
        <h3 class="modal-title">Confirm {{ action }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ prompt }}</p>
      </div>
      <div class="modal-footer">
        <button (click)="confirm()"
                class="btn btn-danger remove-consent">{{ action }}</button>
        <button (click)="cancel()"
                type="button" class="btn">Cancel</button>
      </div>
    </div>
  </div>
</div>

<div *ngIf="show"
     class="modal-backdrop fade in"></div>
`;