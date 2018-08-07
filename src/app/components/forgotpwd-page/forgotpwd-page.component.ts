import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgotpwd-page',
  templateUrl: './forgotpwd-page.component.html',
  styleUrls: ['./forgotpwd-page.component.scss']
})
export class ForgotpwdPageComponent implements OnInit {
  error: any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  resetPassword(email: string) {
    this.authService._resetPassword(email);
    this.error = this.authService.error;
    console.log(this.error)
  }

}
