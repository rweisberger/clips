import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
    public auth: AuthService,
    private afAuth: AngularFireAuth
    ) {
    }
  
  openModal($event: Event) {
    $event.preventDefault()

    this.modal.toggleModal('auth')
  }

  async logout($event: Event) {
    $event.preventDefault()
    
    await this.afAuth.signOut()
  }
}
