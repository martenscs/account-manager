/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { Routes } from '@angular/router';

import { IndexComponent, NoSelectionComponent } from './index/index';
import { ProfileViewComponent, ProfileEditComponent, ChangePasswordComponent,
    RawComponent, RegisterComponent } from './profile/index';
import { ConsentListComponent, ConsentDetailComponent } from './consent/index';
import { PreferenceViewComponent, CommunicationContentEditComponent, TopicEditComponent } from './preference/index';
import { SecondFactorViewComponent } from './second-factor/index';
import { ExternalIdentityListComponent } from './external-identity/index';
import { SessionListComponent } from './session/index';
import { ErrorComponent } from './error/index';

export const ROUTES: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      { path: '', component: NoSelectionComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'profile',
        children: [
          { path: '', component: ProfileViewComponent },
          { path: 'edit', component: ProfileEditComponent },
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'raw', component: RawComponent }
        ]
      },
      {
        path: 'consent',
        children: [
          { path: '', component: ConsentListComponent },
          { path: ':id', component: ConsentDetailComponent }
        ]
      },
      {
        path: 'preference',
        children: [
          { path: '', component: PreferenceViewComponent },
          { path: 'communication-content', component: CommunicationContentEditComponent },
          { path: 'topic', component: TopicEditComponent }
        ]
      },
      { path: 'second-factor', component: SecondFactorViewComponent },
      { path: 'external-identity', component: ExternalIdentityListComponent },
      { path: 'session', component: SessionListComponent }
    ]
  },
  { path: 'error', component: ErrorComponent }
];
