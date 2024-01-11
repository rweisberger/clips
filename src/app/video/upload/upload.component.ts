import { Component } from '@angular/core';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid'
import { AlertComponent } from '../../shared/alert/alert.component';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    EventBlockerDirective, 
    CommonModule, 
    ReactiveFormsModule, 
    InputComponent,
    AlertComponent,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  isDragover = false
  file: File | null = null
  visible = false
  showAlert = false
  alertMessage = 'Please wait! Your clip is being uploaded.'
  alertColor = 'blue'
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User |null = null

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
  
constructor(
  private storage: AngularFireStorage,
  private auth: AngularFireAuth
) {
  auth.user.subscribe(user => this.user = user)
}

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
    this.showAlert = true
    this.alertMessage = 'Please wait! Your clip is being uploaded.'
    this.alertColor = 'blue'
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    const task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    // here we will subscribe to observables to observe progress
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })
    //below we are using the last pipe to access only the last snapshot sent from the observable
    task.snapshotChanges().pipe(
      last(),
      // see lecture 213
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }
        console.log(clip)
        this.alertColor = 'green'
        this.alertMessage = 'Succuss! Your clip is ready to share.'
        this.showPercentage = false
      },
      error: (error) => {
        this.alertColor = 'red',
        this.alertMessage = 'Upload failed - try again later.'
        this.showPercentage = false
        this.inSubmission = true
        console.log('error:', error)
      }
    })
  }
}
