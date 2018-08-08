import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignupPageComponent implements OnInit {
  error: any;

  hide = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
  }

  pwdConfirmChecking(email: string, password: string, passwordConfirm: string) {
    if (password != null && passwordConfirm != null) {
      if (password == passwordConfirm) {
        this.signupWithEmail(email, password);
      }
      else {
        this.error = "passowrd and password confirmation doesn't match";
      }
    }
    else if (password === null && passwordConfirm === null) {
      // this.error = "passowrd and password confirmation doesn't match";
    }
  }

  signupWithEmail(email: string, password: string) {
    this.authService.s_signupWithEmail(email, password);
    this.error = this.authService.s_error;

    // this.router.navigateByUrl('/components/login-page');
    // console.log(this.error);
  }

  signupWithGoogle() {
    this.authService.s_signupWithGoogle();
  }

}
