import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';

// the register component is built as a reactive form
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth
    ) {}
  inSubmission = false

  showAlert = false
  alertMessage = 'Please wait - your account is being created!'
  alertColor = 'blue'

  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      // the minlength can also be added to the html tag
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]
    ),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(120)
    ]
    ),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ]),
    confirmPassword: new FormControl('',
      Validators.required
    ),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13)
    ]),
  })
  async register() {
    // reset the values
    this.showAlert = true 
    this.alertMessage = 'Please wait - your account is being created!'
    this.alertColor = 'blue'
    this.inSubmission = true
      
    const { email, password } = this.registerForm.value
    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(email as string, password as string)
      await this.db.collection('users').add({
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.email,
        phoneNumber: this.registerForm.value
      })
      this.alertMessage = 'Success! Your account has been created.'
      this.alertColor = 'green'
    } catch(err) {
      console.log(err)
      this.alertMessage = 'An unexpected error occurred, Try again later.'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    } 
  } 

}
