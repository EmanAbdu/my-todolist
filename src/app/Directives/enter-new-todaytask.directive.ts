import { Directive, HostListener, ElementRef } from '@angular/core';
import { HomePageComponent } from '../components/home-page/home-page.component';

@Directive({
  selector: '[appEnterNewTodaytask]'
})
export class EnterNewTodaytaskDirective {

  constructor(private homePage: HomePageComponent) { }

  @HostListener('keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 13) {
      let taskName = event.target as HTMLInputElement;
      this.homePage.addNewTodayTask(taskName);
    }
  }

}
