import { Directive, HostListener, ElementRef } from '@angular/core';
import { LoginPageComponent } from '../components/login-page/login-page.component';
import { EmailValidator } from '../../../node_modules/@angular/forms';

@Directive({
  selector: '[appLoginInput]'
})
export class LoginInputDirective {


 
  constructor(public loginPage: LoginPageComponent) { }

  @HostListener('keydown', ['$event'])
  
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    let x = event.keyCode;
    if (x === 13) {
      let email = event.target as HTMLInputElement;
      let password = event.target as HTMLInputElement;
      this.loginPage.loginWithEmail(email.value,password.value);
      // addedItem.value = null;
      
    }
  }

}
