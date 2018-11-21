import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { trigger, animate, style, group, query, transition, state } from '@angular/animations';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
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
  userEmail = sessionStorage.getItem("SignupUserEmail");
  isSignup = this.authService.isSignup;

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
  constructor(public authService: AuthService, private router: Router) { }

  /**
   * ngOnInit function
   */
  ngOnInit() {
    setTimeout(() => {
      this.isSignup = false;
    }, 2000)
  }

  /**
   * 
   * @param email 
   * @param password 
   */
  loginWithEmail(email: string, password: string) {
    this.authService.loginWithEmail(email, password).then(() => {
      this.router.navigateByUrl('/side-nav');
    }).catch((err) => {
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
    this.authService.isRememberMe = this.isRememberMe;

  }

}
