export const template = `
<div [style.display]="show ? 'block' : 'none'"
     class="modal fade in">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button (click)="cancel()"
                type="button" class="close">x</button>
        <h3 class="modal-title">Search Results</h3>
      </div>
      <div class="modal-body">
        <!-- search bar -->
        <div class="row">
          <div class="list-row-toolbar clearfix">
            <div class="col-md-12">
              <div class="pull-right pts">
                <span>{{ users ? users.length : 0 }}</span>
                <span *ngIf="users && users.length == 1">Result</span>
                <span *ngIf="! users || users.length != 1">Results</span>
                Found
              </div>
              <form (submit)="search()">
                <div class="input-group input-group-sm col-xs-6">
                  <input [(ngModel)]="filter"
                         name="filter"
                         type="text" class="form-control"
                         placeholder="Search by username, full name, email or phone">
                  <span class="input-group-btn">
                    <button type="submit" class="btn btn-primary">
                      <span class="glyphicon glyphicon-search"></span>
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- users -->
        <table *ngIf="users && users.length > 0"
               class="table table-condensed mtxl">
          <tr>
            <th scope="col">Full Name</th>
            <th scope="col">UserID</th>
            <th scope="col">Email Address</th>
            <th scope="col">Phone Number</th>
          </tr>
          <tr *ngFor="let user of users">
            <td><a (click)="select(user)" href="javascript:void(0)">{{ user.fullName }}</a></td>
            <td>{{ user.record.userName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
          </tr>
        </table>
      </div>
      <div class="modal-footer">
        <button (click)="cancel()"
                type="button" class="btn">Cancel</button>
      </div>
    </div>
  </div>
</div>

<div *ngIf="show"
     class="modal-backdrop fade in"></div>
`;


