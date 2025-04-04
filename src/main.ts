import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
    ...appConfig,
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding())
  ]
}).catch(err => console.error(err));
