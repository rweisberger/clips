import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    private db: AngularFirestore,
    private auth: AngularFireAuth
   }

  public async createUser(userData) {
    const userCred = await this.auth.createUserWithEmailAndPassword(email as string, password as string)
      await this.db.collection('users').add({
        name: userData.name,
        email: userData.value.email,
        password: userData.email,
        phoneNumber: userData.email
      })

  }
}
