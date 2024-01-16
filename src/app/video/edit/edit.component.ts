import { 
  Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clip.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../../shared/input/input.component";
import { AlertComponent } from "../../shared/alert/alert.component";
import { ClipService } from '../../services/clip.service';

@Component({
    selector: 'app-edit',
    standalone: true,
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css',
    imports: [
      ModalComponent, ReactiveFormsModule, InputComponent, AlertComponent, CommonModule
    ]
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null
  showAlert = false
  alertMessage = 'Please wait! Your clip is being updated.'
  alertColor = 'blue'
  inSubmission = false
  @Output() update = new EventEmitter()

  clipID = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  editFileForm = new FormGroup({
    title: this.title,
    // clipID: this.activeClip
  })

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) {}

  ngOnInit(): void {
    this.modal.register('editClip')
  }    
  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }
  ngOnChanges(): void {
    if (!this.activeClip) {
      return
    }
    this.inSubmission = false
    this.showAlert = false
    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }

  async submit() {
    if(!this.activeClip) {
      return
    }

    this.showAlert = true
    this.alertMessage = 'Please wait! Your clip is being updated.'
    this.alertColor = 'blue'
    this.inSubmission = true
    
    try {
      await this.clipService.updateClip( 
        this.clipID.value, this.title.value
        )
    } 
    catch(e) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMessage = 'An error occurred. Try again later.'
      return
    }
    
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMessage = 'Success!'
  }

}
