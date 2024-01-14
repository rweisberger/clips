import { Injectable } from '@angular/core';
import { 
  AngularFirestore, AngularFirestoreCollection, DocumentReference 
} from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  // applying model as generic
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    ) { 
    this.clipsCollection = db.collection('clips')
  }

  // lecture 219
  createClip(data: IClip) : Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  getUserClips(){
    return this.auth.user.pipe(
      switchMap((user) => {
        if(!user) {
          return of([])
        }
        const query = this.clipsCollection.ref.where(
          'uid', "==", user.uid
        )
        return query.get()
      })
    )
  }
}
