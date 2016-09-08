export const template = `
<div class="page-message">
  <div class="page-message-icon error"><span class="glyphicon glyphicon-exclamation-sign"></span></div>
  <div class="page-message-contents">
    <h3>An Error Occurred</h3>
    <p>{{ message }}</p>
    <a *ngIf="details"
       (click)="showDetails = ! showDetails"
       href="javascript:void(0)"><!--
      --><span *ngIf="! showDetails">View Details</span><!--
      --><span *ngIf="showDetails">Hide Details</span><!--
    --></a>
    <div *ngIf="showDetails" class="mtm">
      {{ details }}
    </div>
  </div>
</div>
`;