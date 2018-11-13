import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import * as firebase from 'firebase';
import { List } from '../Models/List';
import { UserProfile } from '../Models/user-profile';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // ============================= Properties ============================= //
  currentUser: firebase.User;
  userProfile: UserProfile;
  list: List;

  currentUID: string;
  currentUserEmail: string;
  isRememberMe: boolean = true;
  error: string;

  // ============================= Functions ============================= //

  /**
   * This is a constructor function
   * @param afa 
   */
  constructor(private afa: AngularFireAuth) { }

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
  public signupWithGoogle(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider).then((success) => {
        resolve(success.user);
      }).catch((err) => {
        reject(err.message);
      });
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
        if (this.isRememberMe) {
          this.sendToken(this.currentUID, this.currentUserEmail);
        } else {
          this.setSessionToken(this.currentUID, this.currentUserEmail);
        }
        resolve(success.user)
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
  private sendToken(UserIDtoken: string, userEmailToken: string) {
    localStorage.setItem("LoggedInUserID", UserIDtoken);
    localStorage.setItem("LoggedInUserEmail", userEmailToken);
  }

  /**
   * 
   * @param UserIDtoken 
   * @param userEmailToken 
   */
  private setSessionToken(UserIDtoken: string, userEmailToken: string) {
    sessionStorage.setItem("LoggedInUserID", UserIDtoken);
    sessionStorage.setItem("LoggedInUserEmail", userEmailToken);
  }

  /**
   * get UID token
   * @type string 
   */
  private getUserToken() {
    let userToken;
    if (this.isRememberMe) {
      this.currentUID = localStorage.getItem("LoggedInUserID");
      this.currentUserEmail = localStorage.getItem("LoggedInUserEmail");
      userToken = localStorage.getItem("LoggedInUserID");
    } else {
      this.currentUID = sessionStorage.getItem("LoggedInUserID");
      this.currentUserEmail = sessionStorage.getItem("LoggedInUserEmail");
      userToken = sessionStorage.getItem("LoggedInUserID");
    }
    return userToken;
  }

  /**
   * check if the user loggedin
   * @type boolean
   */
  public isLoggednIn() {
    return this.getUserToken() !== null;
  }

  /**
   * reset password function
   * @param email
   * @type Promise
   */
  public resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      return this.afa.auth.sendPasswordResetEmail(email).then(() => {
        resolve("Check your email");
      }).catch((err) => {
        reject(err.message);
      });
    });
  }

  /**
   * logout function 
   * @type void 
   */
  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afa.auth.signOut().then((success) => {
        localStorage.removeItem("LoggedInUserID");
        localStorage.removeItem("LoggedInUserEmail");
        sessionStorage.removeItem("LoggedInUserID");
        sessionStorage.removeItem("LoggedInUserEmail");
        this.currentUID = null;
        resolve(success);
      }).catch((err) => {
        reject(err.messge);
      });
    });
  }

}
