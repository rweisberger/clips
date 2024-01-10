import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserModule } from './user/user.module';
import { NavComponent } from './nav/nav.component';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AuthService } from './services/auth.service';
import { ManageComponent } from './video/manage/manage.component';
import { UploadComponent } from './video/upload/upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UserModule,
    NavComponent,
    AuthModalComponent,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ManageComponent,
    UploadComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 constructor( public auth: AuthService ) {
  // console.log(auth.isAuthenticated$)
 }
}
