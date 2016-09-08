export const template = `
<h3 class="mbm">Change Promotional Message Choices</h3>

<p class="text-muted">In order to send users promotional messages that interest them, we ask for their permission to use
  their email address or mobile phone number for this purpose.</p>

<p class="text-muted">They may revoke these permissions at any time.</p>

<form *ngIf="active"
      (ngSubmit)="submit()"
      novalidate="">
  <div class="form-group">
    <label>Contact Methods</label>
    <div class="checkbox">
      <label>
        <input #emailCb
               [checked]="options.email.polarityOpt === 'in'"
               (change)="options.email.polarityOpt = emailCb.checked ? 'in' : 'out'"
               type="checkbox"> Email
      </label>
    </div>
    <div class="checkbox">
      <label>
        <input #smsCb
               [checked]="options.sms.polarityOpt === 'in'"
               (change)="options.sms.polarityOpt = smsCb.checked ? 'in' : 'out'"
               type="checkbox"> SMS
      </label>
    </div>
  </div>
  <div class="form-group">
    <label>Messages</label>
    <div class="checkbox">
      <label>
        <input #couponsCb
               [checked]="options.coupon.polarityOpt === 'in'"
               (change)="options.coupon.polarityOpt = couponsCb.checked ? 'in' : 'out'"
               type="checkbox"> Coupons
      </label>
    </div>
    <div class="checkbox">
      <label>
        <input #newsletterCb
               [checked]="options.newsletter.polarityOpt === 'in'"
               (change)="options.newsletter.polarityOpt = newsletterCb.checked ? 'in' : 'out'"
               type="checkbox"> Newsletter
      </label>
    </div>
    <div class="checkbox">
      <label>
        <input #notificationsCb
               [checked]="options.notification.polarityOpt === 'in'"
               (change)="options.notification.polarityOpt = notificationsCb.checked ? 'in' : 'out'"
               type="checkbox"> Notifications
      </label>
    </div>
  </div>
  <div class="form-group">
    <label>Frequency</label>
    <div class="radio mln">
      <label>
        <input #dailyRb
               [checked]="options.frequency === 'daily'"
               (change)="options.frequency = 'daily'"
               type="radio"> Daily
      </label>
    </div>
    <input [(ngModel)]="options.time"
           name="time"
           type="time" class="form-control">
    <div class="radio mln">
      <label>
        <input #dailyRb
               [checked]="options.frequency === 'weekly'"
               (change)="options.frequency = 'weekly'"
               type="radio"> Weekly
      </label>
    </div>
    <select [(ngModel)]="options.day" name="day" class="form-control">
      <option value="Sunday">Sunday</option>
      <option value="Monday">Monday</option>
      <option value="Tuesday">Tuesday</option>
      <option value="Wednesday">Wednesday</option>
      <option value="Thursday">Thursday</option>
      <option value="Friday">Friday</option>
      <option value="Saturday">Saturday</option>
    </select>
  </div>
  <div style="margin-top:30px">
    <button class="btn btn-primary" type="submit">Save</button>

    <a [routerLink]="['/preference']"
       class="btn">Cancel</a>
  </div>
</form>
`;