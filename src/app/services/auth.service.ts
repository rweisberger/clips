import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { delay, map, filter, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  // the $ is a naming convention for observables
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect= false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users')
    // subscribe to observable
    this.isAuthenticated$ = auth.user.pipe(
      // below we are type casting user to a boolean
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap((route) => route?.data ?? of({ authOnly: false }))
    ).subscribe((data) => {
      this.redirect = data.authOnly;
    });
  }
  
  public async createUser(userData: IUser) {
    if(!userData.password){
      throw new Error('Password not provided.')
    }
    // auth has to occur before inserting into database
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
      )

      // my solution to add uid- this does ad the uid to the object, but does not replace the id associated with the login wit the uid
      // await this.usersCollection.add({
      //   name: userData.name,
      //   email: userData.email,
      //   age: userData.age,
      //   phoneNumber: userData.email,
      //   uid: userCred.user?.uid
      // })
      
  // set allows us to modify the document

  if(!userCred.user) {
    throw new Error("User can't be found")
  }

  await this.usersCollection.doc(userCred.user.uid).set({
        name: userData.name,
        email: userData.email,
        age: userData.age,
        phoneNumber: userData.email,
      })

      await userCred.user.updateProfile({
        displayName: userData.name
      })
  }

  public async logout($event?: Event) {
    if($event) {
      $event.preventDefault()
    }
    
    await this.auth.signOut()

    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }
}
