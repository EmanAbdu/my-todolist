import { Directive, HostListener, ElementRef } from '@angular/core';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { Task } from '../Models/Task';

@Directive({
  selector: '[appEnterNewTask]'
})
export class EnterNewTaskDirective {

  constructor(private homePage: HomePageComponent) { }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 13) {
      let taskName = event.target as HTMLInputElement;
      this.homePage.addNewTask(taskName);


    }
  }

}
