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


  list: List = {
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
   * This is a constructor function
   * @param afa 
   * @param router 
   */
  constructor(
    private afa: AngularFireAuth, private router: Router) { }

  /**
   * signup with email function that reruns Promise
   * 
   * @param email 
   * @param password
   * @return Promise
   */
  public signupWithEmail(email: string, password: string): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.afa.auth.createUserWithEmailAndPassword(email, password).then(
        (success) => {
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
   * login with email function that reruns Promise
   * @param email 
   * @param password 
   * @return Promise
   */
  public loginWithEmail(email, password): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.afa.auth.signInWithEmailAndPassword(email, password).then((success) => {
        //fetch current user id and email
        this.currentUser = success.user;
        this.currentUID = this.currentUser.uid;
        this.currentUserEmail = this.currentUser.email;
        this.sendToken(this.currentUID, this.currentUserEmail);
        this.router.navigateByUrl('/side-nav');
        console.log(this.currentUser);
        resolve(success.user);
      }).catch((err) => {
        reject(err.message)
      });
    });
  }

  /**
   * set UID and email in Local Storage 
   * @param UserIDtoken 
   * @param userEmailToken 
   */
  sendToken(UserIDtoken: string, userEmailToken: string) {
    localStorage.setItem("LoggedInUserID", UserIDtoken);
    localStorage.setItem("LoggedInUserEmail", userEmailToken);
  }

  /**
   * get UID token
   * @type string 
   */
  getUIDToken() {
    // return localStorage.getItem("LoggedInUserID");
    this.currentUID = localStorage.getItem("LoggedInUserID");
    this.currentUserEmail = localStorage.getItem("LoggedInUserEmail");
    return localStorage.getItem("LoggedInUserID");
  }
  
  /**
   * get Email token
   * @type string
   */
  getEmailToken() {
    this.currentUserEmail = localStorage.getItem("LoggedInUserEmail");
    return localStorage.getItem("LoggedInUserEmail");
  }

  /**
   * check if the user loggedin
   * @type boolean
   */
  isLoggednIn() {
    return (this.getUIDToken() !== null && this.getEmailToken() !== null);
    // this.s_currentUID= this.getToken();
  }
 
 /**
  * reset password function
  * @param email
  * @type Promise
  */
  public resetPassword(email: string) {
    return new Promise((resolve, reject)=>{
      return this.afa.auth.sendPasswordResetEmail(email).then(() =>{
      resolve("Check your email");
      
      }) .catch((err) => {
        reject(err.message);

      });
    });
  }
 
  /**
   * logout function 
   * @type void 
   */
  public logout() {
    this.afa.auth.signOut().then(() => {
      localStorage.removeItem("LoggedInUserID");
      localStorage.removeItem("LoggedInUserEmail");
      localStorage.removeItem("LoggedInUser");
      this.currentUID = null;
      this.router.navigateByUrl('/login-page');
    });

  }


}
