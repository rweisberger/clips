import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import IUser from '../../models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

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
    private auth: AuthService,
    private emailTaken: EmailTaken
    ) {  
    }
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
    ], [this.emailTaken.validate]
    ),
    age: new FormControl<number | null>(null, [
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
  }, [RegisterValidators.match('password', 'confirmPassword')])

  async register() {
    // reset the values
    this.showAlert = true 
    this.alertMessage = 'Please wait - your account is being created!'
    this.alertColor = 'blue'
    this.inSubmission = true
      
    try {
      await this.auth.createUser(this.registerForm.value as IUser)
      
    } catch(err) {
      console.log(err)
      this.alertMessage = 'An unexpected error occurred, try again later.'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    } 
    this.alertMessage = 'Success! Your account has been created.'
    this.alertColor = 'green'
  } 

}
