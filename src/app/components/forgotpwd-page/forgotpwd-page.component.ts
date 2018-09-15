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
  error: any;

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
    this.authService.resetPassword(email);
    this.error = this.authService.error;
    console.log(this.error)
  }

}
