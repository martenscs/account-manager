export const template = `
<div *ngIf="requirements && requirements.length"
     class="ptm">
  <a (click)="showRequirements = ! showRequirements"
     href="javascript:void(0)"><!--
     --><span *ngIf="! showRequirements">Show Requirements</span><!--
     --><span *ngIf="showRequirements">Hide Requirements</span><!--
     --></a>
</div>
<div *ngIf="requirements && requirements.length && showRequirements"
     class="well well-sm" style="max-height:150px;overflow:auto;margin-bottom:15px">
  <div *ngFor="let requirement of requirements"
       [ngClass]="getContainerClass(requirement)"
       class="pass-req">
    <span [ngClass]="getIconClass(requirement)"
          class="glyphicon"></span>
    {{ requirement.description }}
  </div>
</div>
`;