import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';


@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() control: FormControl = new FormControl()
  @Input() type = 'text'
  @Input() placeHolder = ''
  @Input() format = ""
  /** we are going to use masking for the phone number below we are essentially disabling it for other inputs by
  * setting the default format to an empty string
  */ 
}
