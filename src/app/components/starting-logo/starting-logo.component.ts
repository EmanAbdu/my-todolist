import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, animate, style, group, query, transition, state } from '@angular/animations';

@Component({
  selector: 'app-starting-logo',
  templateUrl: './starting-logo.component.html',
  styleUrls: ['./starting-logo.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1500)),
    ]),
  ]
})
export class StartingLogoComponent implements OnInit {
  currentState = 'initial';

  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }
  constructor(public router: Router) { }

  ngOnInit() {

    setTimeout(()=> {
      this.router.navigateByUrl('/login-page');

    }, 2000)
  }

}