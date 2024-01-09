import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]',
  standalone: true
})
export class EventBlockerDirective {

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault()
  }

}
