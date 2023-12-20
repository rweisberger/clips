import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

// this form is build with a template form
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule, AlertComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  }
  constructor(private auth: AngularFireAuth) {
  }

  showAlert = false
  alertMessage = 'Please wait while we login to your account!'
  alertColor = 'blue'
  inSubmission = false

  async login() {
    this.showAlert = true 
    this.alertMessage = 'Please wait while we find your account!'
    this.alertColor = 'blue'
    this.inSubmission = true

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      )
    } 
    catch(err) {
      console.log(err)
      this.alertMessage = 'An error has occurred - double check your credentials.'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }
    this.alertMessage = 'Welcome!'
    this.alertColor = 'green'
  }
}
