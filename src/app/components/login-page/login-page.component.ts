import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { auth } from 'firebase';

import {FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  // animations:[moveIn()],
  // host: {'[@moveIn]': ''}
})
export class LoginPageComponent implements OnInit {

  hide = true;
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(public authService: AuthService) { }
  currentUser: string;
  ngOnInit() {
  }

  loginWithEmail(email: string, password: string) {
    this.authService.S_loginWithEmail(email, password);
    this.currentUser = this.authService.currentUser;
  }

  signupWithGoogle() {
    this.authService.S_signupWithGoogle();
    this.currentUser = this.authService.currentUser;
  }

}
