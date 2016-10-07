/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Routes } from '@angular/router';

import { IndexComponent, NoSelectionComponent } from './index/index';
import { ProfileViewComponent, ProfileEditComponent, ResetPasswordComponent, RawComponent,
    RegisterComponent } from './profile/index';
import { ConsentListComponent, ConsentDetailComponent } from './consent/index';
import { PreferenceViewComponent, CommunicationContentEditComponent, TopicEditComponent } from './preference/index';
import { SecondFactorViewComponent } from './second-factor/index';
import { ExternalIdentityListComponent } from './external-identity/index';
import { SessionListComponent } from './session/index';
import { ErrorComponent } from './error/index';
import { SelectProfileGuard } from './shared/index';

export const ROUTES: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      { path: '', component: NoSelectionComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'profile',
        canActivate: [ SelectProfileGuard ],
        children: [
          { path: '', component: ProfileViewComponent },
          { path: 'edit', component: ProfileEditComponent },
          { path: 'reset-password', component: ResetPasswordComponent },
          { path: 'raw', component: RawComponent }
        ]
      },
      {
        path: 'consent',
        canActivate: [ SelectProfileGuard ],
        children: [
          { path: '', component: ConsentListComponent },
          { path: ':id', component: ConsentDetailComponent }
        ]
      },
      {
        path: 'preference',
        canActivate: [ SelectProfileGuard ],
        children: [
          { path: '', component: PreferenceViewComponent },
          { path: 'communication-content', component: CommunicationContentEditComponent },
          { path: 'topic', component: TopicEditComponent }
        ]
      },
      {
        path: 'second-factor',
        component: SecondFactorViewComponent,
        canActivate: [ SelectProfileGuard ]
      },
      {
        path: 'external-identity',
        component: ExternalIdentityListComponent,
        canActivate: [ SelectProfileGuard ]
      },
      {
        path: 'session',
        component: SessionListComponent,
        canActivate: [ SelectProfileGuard ]
      }
    ]
  },
  { path: 'error', component: ErrorComponent }
];
