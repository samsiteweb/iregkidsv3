import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-btn',
  templateUrl: './custom-btn.component.html',
  styleUrls: ['./custom-btn.component.scss']
})
export class CustomBtnComponent implements OnInit {

  @Input() text: string = "Button"
  @Input() color: string = "Primary"
  @Input() isloading: boolean = false
  @Input() type: string = 'button'
  @Input() disabled: boolean = false
  @Output() btnClicked = new  EventEmitter<any>()

  constructor() { }

  ngOnInit(): void {
  }

  handleClicks() {
    this.btnClicked.emit()
  }

}
