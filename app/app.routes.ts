/**
 * Copyright 2016-2017 Ping Identity Corporation
 * All Rights Reserved.
 */

import { Routes } from '@angular/router';

import { IndexComponent, NoSelectionComponent } from './index/index';
import { ProfileViewComponent, ProfileEditComponent, RawComponent,
    RegisterComponent } from './profile/index';
import { PreferenceViewComponent, CommunicationContentEditComponent, TopicEditComponent } from './preference/index';
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
          { path: 'raw', component: RawComponent }
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
    ]
  },
  { path: 'error', component: ErrorComponent }
];
