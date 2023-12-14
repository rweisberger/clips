import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  // providers: [ModalService]
})
export class ModalComponent {
  @Input() modalID = ''

  constructor(public modal: ModalService) {
    // console.log(this.modal.visible
  }

  closeModal() {
    this.modal.toggleModal(this.modalID)
  }
}
