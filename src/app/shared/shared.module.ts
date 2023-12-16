import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';
import { AlertComponent } from './alert/alert.component';
// import { ModalService } from '../services/modal.service';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    NgxMaskDirective,
    AlertComponent
  ],
  exports: [
    InputComponent,
    AlertComponent
  ],
  providers: [
    provideEnvironmentNgxMask()
  ],
})
export class SharedModule { }
