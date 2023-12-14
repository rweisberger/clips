import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  public modals: IModal[] = []
  
  constructor() { }

  register(id: string) {
    this.modals.push({
      id,
      visible: false 
    })
  }

  // unregister(id: string) {
  //   this.modals.filter(
  //     element => element.id !== id
  //   )
  // }

  isModalOpen(id: string) : boolean {
    // return !!this.modals.find((element) => element.id === id)?.visible
    return Boolean(this.modals.find((element) => element.id === id)?.visible)
  }  

  toggleModal(id: string) {
    const modal = this.modals.find(element => element.id === id)
    console.log(modal)

    if(modal) modal.visible = !modal.visible
  }
}
