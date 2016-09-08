/**
 * Copyright 2016 UnboundID Corp.
 * All Rights Reserved.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LayoutComponent, ConfirmComponent, AddressPipe, CapitalizePipe, ElapsedTimePipe, IfFunctionalityDirective,
    AlertService, LoadingService, HttpWrapper, ScimService } from './shared/index'
import { IndexComponent, SearchComponent, NoSelectionComponent } from './index/index';
import { ProfileViewComponent, ProfileEditComponent, ChangePasswordComponent,
    PasswordRequirementsComponent, RawComponent, RegisterComponent } from './profile/index';
import { ConsentListComponent, ConsentDetailComponent } from './consent/index';
import { PreferenceViewComponent, CommunicationContentEditComponent, TopicEditComponent } from './preference/index';
import { SecondFactorViewComponent } from './second-factor/index';
import { ExternalIdentityListComponent } from './external-identity/index';
import { SessionListComponent } from './session/index';
import { ErrorComponent } from './error/index';
import { Configuration } from './app.config';
import { ROUTES } from './app.routes';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    ConfirmComponent,
    SearchComponent,
    NoSelectionComponent,
    IndexComponent,
    ProfileViewComponent,
    ProfileEditComponent,
    ChangePasswordComponent,
    PasswordRequirementsComponent,
    RawComponent,
    RegisterComponent,
    ConsentListComponent,
    ConsentDetailComponent,
    PreferenceViewComponent,
    CommunicationContentEditComponent,
    TopicEditComponent,
    SecondFactorViewComponent,
    ExternalIdentityListComponent,
    SessionListComponent,
    ErrorComponent,
    AddressPipe,
    CapitalizePipe,
    ElapsedTimePipe,
    IfFunctionalityDirective
  ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: Window, useValue: window },
    Configuration,
    AlertService,
    LoadingService,
    HttpWrapper,
    ScimService
  ]
})
export class AppModule { }
