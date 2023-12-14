import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Input, Inject, ElementRef } from '@angular/core';
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

  constructor(
    public modal: ModalService,
    public el: ElementRef
  ) { 
    
  }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)
  }

  closeModal() {
    this.modal.toggleModal(this.modalID)
  }
}
