import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() color = 'blue'

  // we are adding the get keyword because it is a getter property- we don't want to directly access the color, just modify it
  get bgColor() {
    console.log('bg-${this.color}-400')
    return `bg-${this.color}-400`
  }
}
