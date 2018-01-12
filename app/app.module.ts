/**
 * Copyright 2016-2018 Ping Identity Corporation
 * All Rights Reserved.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LayoutComponent, ConfirmComponent, AddressPipe, CapitalizePipe, ElapsedTimePipe, IfFunctionalityDirective,
    AlertService, LoadingService, HttpWrapper, ScimService, SelectProfileGuard } from './shared/index'
import { IndexComponent, SearchComponent, NoSelectionComponent } from './index/index';
import { ProfileViewComponent, ProfileEditComponent, RawComponent, RegisterComponent } from './profile/index';
import { PreferenceViewComponent, CommunicationContentEditComponent, TopicEditComponent } from './preference/index';
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
    RawComponent,
    RegisterComponent,
    PreferenceViewComponent,
    CommunicationContentEditComponent,
    TopicEditComponent,
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
    ScimService,
    SelectProfileGuard
  ]
})
export class AppModule { }
