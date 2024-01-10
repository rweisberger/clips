import { Component } from '@angular/core';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    EventBlockerDirective, 
    CommonModule, 
    ReactiveFormsModule, 
    InputComponent
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  isDragover = false
  file: File | null = null
  visible = false

  title= new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

uploadFileForm = new FormGroup({
  title: this.title
})
  

  storeFile($event: Event) {
    this.isDragover = false
    // nullish coalescing
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/,'')
      )
    this.visible = true

    console.log("here storefile", this.file.name)
  }

  uploadFile() {
    console.log("file uploaded")
  }
}
