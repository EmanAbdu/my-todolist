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
  password: string = ""

  public hide: boolean = true;
  // public currentUser: string = this.authService.s_currentUID;

  // ----- Email Form Control ----- //
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  // ============================= Functions ============================= //

  // ----- constructor ----- //
  constructor(public authService: AuthService) { }

  // ----- ngOnInit ----- //
  ngOnInit() {
  }

  // ----- Login With Email ----- //
  loginWithEmail(email: string, password: string) {
    this.authService.s_loginWithEmail(email, password);
    this.email="";
    this.password="";
  }

  // ----- Signup With Google ----- //
  signupWithGoogle() {
    this.authService.s_signupWithGoogle();

  }

}
