import { Injectable } from '@angular/core';
import { 
  AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot 
} from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  // applying model as generic
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
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
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({ title })
  }

  async deleteClip(clip: IClip) {
    // we must delete the video from storage and from the database
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    
    await clipRef.delete()

    await this.clipsCollection.doc(clip.docID).delete()
  }
}