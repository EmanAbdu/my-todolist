import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UploadFileService } from '../../services/upload-file.service';
import { TasksOperationService } from '../../services/tasks-operation.service';
import { List } from '../../Models/List';
import { UserProfile } from '../../Models/user-profile';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class SignupPageComponent implements OnInit {

  // ============================= Properties ============================= //  
  error: any;
  hide = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  list: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  defList: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  userProfile: UserProfile = {
    profileId: '',
    UID: '',
    displayName: '',
    imageUrl: '',
    status: '',
  }


  // ============================= Functions ============================= //  

  /**
   * constructor function
   * @param authService 
   * @param router 
   */
  constructor(public authService: AuthService,
    private tasksOperationService: TasksOperationService,
    private uploadFileService: UploadFileService,
    public router: Router) { }

  /**
   * 
   */
  ngOnInit() {
  }

  /**
   * 
   * @param email 
   * @param password 
   * @param passwordConfirm 
   */
  pwdConfirmChecking(email: string, password: string, passwordConfirm: string) {
    if (password != null && passwordConfirm != null) {
      if (password == passwordConfirm) {
        this.signupWithEmail(email, password);
      }
      else {
        this.error = "passowrd and password confirmation doesn't match";
      }
    }
  }

  /**
   * 
   * @param email 
   * @param password 
   */
  signupWithEmail(email: string, password: string) {
    this.authService.signupWithEmail(email, password).then((success) => {
      let userID = success.uid;
      let userEmail = success.email;
      //add default profile and my day list 
      this.userProfile = { UID: userID, displayName: userEmail, imageUrl: 'https://goo.gl/UpkPCy', status: 'I can do it' };
      this.defList = { listName: "My Day", UID: userID };
      this.list = { listName: "Unitiled List", UID: userID };
      this.uploadFileService.addUserProfile(this.userProfile);
      this.tasksOperationService.addDefList(this.defList);
      this.tasksOperationService.addList(this.list);

      //return back to login page 
      this.router.navigateByUrl('/login-page'); //promise

    }).catch(
      (err) => {
        this.error = err;
      });
  }

  /**
   * 
   */
  signupWithGoogle() {
    this.authService.signupWithGoogle();
  }

}
