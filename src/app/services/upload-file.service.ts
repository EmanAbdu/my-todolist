import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import 'firebase/storage';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
 import {UserProfile} from '../Models/user-profile';
import { FileUpload } from '../Models/upload-files';
 
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  // ============================= Properties ============================= //
  userProfile$: Observable<UserProfile[]>;
  useProfileCollection:AngularFirestoreCollection<UserProfile>;
  userProfileDoc: AngularFirestoreDocument<UserProfile>;
 
  private basePath = '/uploads';
  public imgUrl:string;
 
    // ============================= Functions ============================= //
    /**
     * 
     * @param db 
     * @param afs 
     */
  constructor(private db: AngularFireDatabase, public  afs: AngularFirestore) { 
    this.useProfileCollection = this.afs.collection('User Profile', ref => ref.orderBy('UID', 'asc'));
  }

  /**
   * 
   * @param uid 
   */
  public filterProfileByUID(uid: string | null): any {
    this.useProfileCollection = this.afs.collection<UserProfile>('User Profile', ref => {
      return ref.where('UID', '==', uid);
    });
    this.getUserProfile();
  }

/**
 * @param fileUpload
 * @param progress
 */
  public pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }) {
    return new Promise((resolve,reject) =>{
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);
   
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // in progress
          const snap = snapshot as firebase.storage.UploadTaskSnapshot;
          progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        },
        (error) => { // fail
          console.log(error);
        },
        () => { // success
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload);
            this.imgUrl= downloadURL;
          });
        }
      );
      resolve();
    });      
  }
 
  /**
   * 
   * @param fileUpload 
   */
  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload);
  }

/**
 * 
 */
  public getUserProfile () {
    this.userProfile$ = this.useProfileCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const profileData = a.payload.doc.data() as UserProfile;
          profileData.profileId = a.payload.doc.id;
          return profileData;
        })
      })
    );
  }

  /**
   * 
   */
  public getObservableUserProfile() {
    return this.userProfile$;
  }

  /**
   * 
   * @param userProfile 
   */
 public addUserProfile(userProfile: UserProfile){
    this.useProfileCollection.add(userProfile);
  }

/**
 * 
 * @param updatedPeofile 
 */
 public updateProfile(updatedPeofile){
    this.userProfileDoc = this.afs.doc(`User Profile/${updatedPeofile.profileId}`);
    this.userProfileDoc.update(updatedPeofile);
  }
 
}