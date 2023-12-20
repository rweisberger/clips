import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(
    public modal: ModalService,
    public auth: AuthService
    ) {
    }
  

  openModal($event: Event) {
    $event.preventDefault()

    this.modal.toggleModal('auth')
  }
}
