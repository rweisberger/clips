import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from './environments/environment';

firebase.initializeApp(environment.firebase)

// defining the variable will prevent angular from being initialized with every auth change
let appInit = false;

firebase.auth().onAuthStateChanged(() => {
  if(!appInit) {
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error(err));
  }
  appInit = true
})


