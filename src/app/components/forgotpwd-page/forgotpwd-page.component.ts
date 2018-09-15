import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgotpwd-page',
  templateUrl: './forgotpwd-page.component.html',
  styleUrls: ['./forgotpwd-page.component.scss']
})
export class ForgotpwdPageComponent implements OnInit {

  // ============================= Properties ============================= //
  sendingEmailSuccess: any;
  sendingEmailError: string;
  

  // ----- Email Form Control ----- //
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  // ============================= Functions ============================= //

  // ----- Constructor ----- //
  constructor(public authService: AuthService) { }

  // ----- ngOnInit ----- //
  ngOnInit() {
  }

  // ----- Reset Passowrd Function ----- //
  resetPassword(email: string) {
    this.authService.resetPassword(email).then((success) => {
      this.sendingEmailSuccess = success;
      this.sendingEmailError = null;
    }).catch((err) => {
      this.sendingEmailSuccess = null;
      this.sendingEmailError = err;
    })

  }

}
