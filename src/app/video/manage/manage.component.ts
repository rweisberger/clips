import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClip from '../../models/clip.model';
import { CommonModule } from '@angular/common';
import { EditComponent } from '../edit/edit.component';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-manage',
    standalone: true,
    templateUrl: './manage.component.html',
    styleUrl: './manage.component.css',
    imports: [CommonModule, EditComponent]
})

export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null 
  sort$: BehaviorSubject<string>  

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private clipService: ClipService,
      private modal: ModalService
    ) {
      this.sort$ = new BehaviorSubject(this.videoOrder)
    }
  
    ngOnInit(): void {
      this.route.queryParams.subscribe((params: Params) => {
        this.videoOrder = params['sort'] === '2' ? params['sort'] : '1'
        this.sort$.next(this.videoOrder)
      })
      this.clipService.getUserClips(this.sort$).subscribe(docs => {
        this.clips = []

        docs.forEach(doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data()
          })
        })
      })
    }

  sort(event: Event){
    const { value } = (event.target as HTMLSelectElement)

    this.router.navigateByUrl(`/manage?sort=${value}`)

    // another option to include the query parameters
    // this.router.navigate([], {
    //   relativeTo: this.route, 
    //   queryParams: {
    //     sort: value
    //   }
    // })
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()

    this.activeClip = clip

    this.modal.toggleModal('editClip')
  }

  update($event: IClip) {
    console.log($event)
    this.clips.forEach((element, index) => {
      if(element.docID == $event.docID)
      this.clips[index].title = $event.title
    })
  }
  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()

    this.clipService.deleteClip(clip)
    
    this.clips.forEach((element, index) => {
      if(element.docID == clip.docID) {
        this.clips.splice(index, 1)
      } 
    })
  }
}
