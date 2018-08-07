import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  error: any;
  currentUser: string;

  //-------------------------------- Constructor Functions -------------------------------- //
  constructor(public afa: AngularFireAuth, public router: Router) { }

//-------------------------------- Constructor Functions -------------------------------- //
  public S_signupWithEmail(email: string, password: string) {

    this.afa.auth.createUserWithEmailAndPassword(email, password).then(
      (success) => {
        this.router.navigateByUrl('/components/login-page'); //promise
      }).catch(
        (err) => {
          this.error = err.message;
        }
      )

      //promise --> then,catch
    // console.log(this.error);

  }
  //--------------------------------------------------------//
  public S_signupWithGoogle() {
    this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider).then(
      (success) => {
        this.router.navigateByUrl('/components/side-nav');
      }).catch(
        (err) => {
          this.error = err.message;
        }
      );
    this.currentUser = this.afa.auth.currentUser.uid;
    // console.log(this.currentUser);

  }
  //--------------------------------------------------------//

  public S_loginWithEmail(email, password) {
    this.afa.auth.signInWithEmailAndPassword(email, password).then(
      (success) => {
        this.router.navigateByUrl('/components/side-nav');

      }).catch(
        (err) => {
          this.error = err.message;

        }
      );
    this.currentUser = this.afa.auth.currentUser.uid;
    // console.log(this.currentUser);

  }

  //--------------------------------------------------------//
  public S_resetPassword(email: string) {
    return this.afa.auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((err) => {

        this.error = err.message;

        // console.log(this.error);
      }
      );

  }
  //--------------------------------------------------------//

  public S_logout() {
    this.afa.auth.signOut();

  }
}
