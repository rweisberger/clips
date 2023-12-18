import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// this form is build with a template form
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  }
  login() {
    console.log("call login", this.credentials)
  }
}
