/**
 * Copyright 2016-2017 UnboundID Corp.
 * All Rights Reserved.
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';


enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
