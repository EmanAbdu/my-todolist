import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  // animations:[moveIn()],
  // host: {'[@moveIn]': ''}
})
export class LoginPageComponent implements OnInit {

  // ============================= Properties ============================= //

  email: string = "";
  password: string = "";
  error: any;
  hide: boolean = true; // to hide the password digits
  isRememberMe = true;

  // ----- Email Form Control ----- //
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  // ============================= Functions ============================= //

  /**
   * constructor function
   * @param authService
   */
  constructor(public authService: AuthService) { }

  /**
   * ngOnInit function
   */
  ngOnInit() {
  }

  /**
   * 
   * @param email 
   * @param password 
   */
  loginWithEmail(email: string, password: string) {
    this.authService.loginWithEmail(email, password).catch((err) => {
      this.error = err
    });
  }


  /**
   * 
   */
  signupWithGoogle() {
    this.authService.signupWithGoogle();
    this.error = this.authService.error;

  }

  changeRemeberMe() {
    this.isRememberMe = !this.isRememberMe;
    this.authService.isRememberMe= this.isRememberMe;
    console.log(this.isRememberMe);
  }

}
