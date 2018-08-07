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
  constructor(public afa: AngularFireAuth, public router: Router) { }

  public _signupWithEmail(email: string, password: string) {

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
  public _signupWithGoogle() {
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

  public _loginWithEmail(email, password) {
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
  public _resetPassword(email: string) {
    return this.afa.auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((err) => {

        this.error = err.message;

        // console.log(this.error);
      }
      );

  }
  //--------------------------------------------------------//

  public _logout() {
    this.afa.auth.signOut();

  }
}
