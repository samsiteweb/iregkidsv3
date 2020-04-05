import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() message: string = 'message'
  @Input() title: string = 'Title'
  @Input() showBack: boolean = true
  @Input() showForward: boolean = true
  @Input() forwardText: string = "Continue Registration"
  @Input() backText: string = "Back to Login"
  @Output() forwardClicked = new EventEmitter<any>()
  @Output() backClicked = new EventEmitter<any>()

  constructor() { }

  emitEvent(type) {
    type === 'forward' ? this.forwardClicked.emit() : this.backClicked.emit()
  }
  ngOnInit(): void {
  }

}
