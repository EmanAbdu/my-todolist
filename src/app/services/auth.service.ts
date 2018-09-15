import { Injectable } from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { List } from '../Models/List';
// import { Task } from '../Models/Task';
import { TasksOperationService } from './tasks-operation.service';
import { UploadFileService } from './upload-file.service';
import { UserProfile } from '../Models/user-profile';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // ============================= Properties ============================= //
  currentUser: firebase.User;
  currentUID: string;
  currentUserEmail: string;
  error: string;


  lists: List[];
  list: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  userProfiles: UserProfile[];
  userProfile: UserProfile = {
    profileId: '',
    UID: '',
    displayName: '',
    imageUrl: '',
    status: '',
  }


  // ============================= Functions ============================= //

  /**
   * 
   * @param afa 
   * @param tasksOperationService 
   * @param uploadFileService 
   * @param router 
   */
  constructor(
    private afa: AngularFireAuth,
    private tasksOperationService: TasksOperationService,
    private uploadFileService: UploadFileService,
    private router: Router) { }

  /**
   * 
   * @param email 
   * @param password
   * @return Promise
   */
  public signupWithEmail(email: string, password: string): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.afa.auth.createUserWithEmailAndPassword(email, password).then((success) => {
        //fetch current user id and email
        let userID = success.user.uid;
        let userEmail = success.user.email;
        //add default profile and my day list 
        this.userProfile = { UID: userID, displayName: userEmail, imageUrl: 'https://goo.gl/UpkPCy', status: 'I can do it' };
        this.list = { listName: "My Day", UID: userID }
        this.uploadFileService.addUserProfile(this.userProfile);
        this.tasksOperationService.addList(this.list);
        //return back to login page 
        this.router.navigateByUrl('/login-page'); //promise
        resolve(success.user);
      }).catch((err) => {

        reject(err.message);
      });
    });
  }


  /**
   * 
   */
  public signupWithGoogle() {

    this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider).then((success) => {
      this.router.navigateByUrl('/side-nav');
      this.currentUID = this.afa.auth.currentUser.uid;
      console.log(this.currentUID);

    }).catch((err) => {
      this.error = err.message;
    });
  }

  /**
   * 
   * @param email 
   * @param password 
   * @return Promise
   */
  public loginWithEmail(email, password): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.afa.auth.signInWithEmailAndPassword(email, password).then((success) => {
          //fetch current user id and email
          this.currentUser = success.user;
          this.currentUID = this.currentUser.uid; //change cuurent user id 
          this.currentUserEmail = this.currentUser.email;
          this.sendToken(this.currentUID, this.currentUserEmail);
          this.setToken(this.currentUser);
          this.router.navigateByUrl('/side-nav');
          resolve(success.user);
        }).catch((err) => {
            reject(err.message)
          });
    });
  }

/**
 * 
 * @param user 
 */
  setToken(user: firebase.User) {
    localStorage.setItem("LoggedInUser", JSON.stringify({ user: user }));

  }

/**
 * 
 * @param UserIDtoken 
 * @param userEmailToken 
 */
  sendToken(UserIDtoken: string, userEmailToken: string) {
    localStorage.setItem("LoggedInUserID", UserIDtoken);
    localStorage.setItem("LoggedInUserEmail", userEmailToken);

  }
/**
 * 
 */
  getUIDToken() {
    // return localStorage.getItem("LoggedInUserID");
    this.currentUID = localStorage.getItem("LoggedInUserID");
    this.currentUserEmail = localStorage.getItem("LoggedInUserEmail");
    return localStorage.getItem("LoggedInUserID");
  }
/**
 * 
 */
  getEmailToken() {
    this.currentUserEmail = localStorage.getItem("LoggedInUserEmail");
    return localStorage.getItem("LoggedInUserEmail");
  }
/**
 * 
 */
  isLoggednIn() {
    return (this.getUIDToken() !== null && this.getEmailToken() !== null);
    // this.s_currentUID= this.getToken();
  }

  // ----- Service Reset Password ----- //
  public resetPassword(email: string) {
    return this.afa.auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((err) => {

        this.error = err.message;
      });

  }
  // ----- Service Logout ----- //
  public logout() {
    this.afa.auth.signOut().then(()=>{
      localStorage.removeItem("LoggedInUserID");
      localStorage.removeItem("LoggedInUserEmail");
      localStorage.removeItem("LoggedInUser");
      this.currentUID = null;
      this.router.navigateByUrl('/login-page');
    });
  
  }


}
