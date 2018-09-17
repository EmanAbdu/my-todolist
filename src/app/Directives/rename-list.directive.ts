import { Directive, HostListener, ElementRef } from '@angular/core';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { List } from '../Models/List';

@Directive({
  selector: '[appRenameList]'
})

export class RenameListDirective {

  constructor(private homePage: HomePageComponent) { }

  @HostListener('keydown', ['$event'])
  
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    let x = event.keyCode;
    if (x === 13) {
      this.homePage.renameList();
    }
  }

}