import { Component, OnDestroy } from '@angular/core';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid'
import { AlertComponent } from '../../shared/alert/alert.component';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';

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
export class UploadComponent implements OnDestroy {
  isDragover = false
  file: File | null = null
  visible = false
  showAlert = false
  alertMessage = 'Please wait! Your clip is being uploaded.'
  alertColor = 'blue'
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null
  task?: AngularFireUploadTask

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
  private auth: AngularFireAuth,
  private clipService: ClipService,
  private router: Router,
) {
  auth.user.subscribe(user => this.user = user)
}

// this will stop uploads if the user leaves the component/upload tab
ngOnDestroy(): void {
  this.task?.cancel()
}

  storeFile($event: Event) {
    console.log($event)
    this.isDragover = false
    // nullish coalescing
    this.file = ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0) ?? null

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
    this.uploadFileForm.disable()

    this.showAlert = true
    this.alertMessage = 'Please wait! Your clip is being uploaded.'
    this.alertColor = 'blue'
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    this.task= this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    // here we will subscribe to observables to observe progress
    this.task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })
    //below we are using the last pipe to access only the last snapshot sent from the observable
    this.task.snapshotChanges().pipe(
      last(),
      // see lecture 213
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        console.log(clip)
        const clipDocRef = await this.clipService.createClip(clip)
        
        this.alertColor = 'green'
        this.alertMessage = 'Succuss! Your clip is ready to share.'
        this.showPercentage = false
          // redirect user after they see success message
          setTimeout(() => {
            this.router.navigate([
              'clip', clipDocRef.id
            ])
          }, 1000)
      },
      error: (error) => {
        this.uploadFileForm.enable()

        this.alertColor = 'red',
        this.alertMessage = 'Upload failed - try again later.'
        this.showPercentage = false
        this.inSubmission = true
        console.log('error:', error)
      }
    })
  }
}
