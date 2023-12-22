import { CommonModule, DOCUMENT  } from '@angular/common';
import { Component, Input, PLATFORM_ID, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  // providers: [ModalService]
})
export class ModalComponent implements OnInit, OnDestroy{
  @Input() modalID = ''

  constructor(
    public modal: ModalService,
    public el: ElementRef,
    @Inject(DOCUMENT) public document: Document,
    @Inject(PLATFORM_ID) private platformId: any,

  ) { 
    
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.appendChild(this.el.nativeElement)
    }
  }
  

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.removeChild(this.el.nativeElement)
    }
  }

  closeModal() {
    this.modal.toggleModal(this.modalID)
  }
}
