import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
 import {UserProfile} from '../Models/user-profile';
import { FileUpload } from '../Models/upload-files';
 
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  userProfile$: Observable<UserProfile[]>;
  useProfileCollection:AngularFirestoreCollection<UserProfile>;
  userProfileDoc: AngularFirestoreDocument<UserProfile>;
 
  private basePath = '/uploads';

  public imgUrl:string;
 
  constructor(private db: AngularFireDatabase, public  afs: AngularFirestore) { 
    this.useProfileCollection = this.afs.collection('User Profile', ref => ref.orderBy('UID', 'asc'));

  }

  filterByUID(uid: string | null): any {

    this.useProfileCollection = this.afs.collection<UserProfile>('User Profile', ref => {
      return ref.where('UID', '==', uid);
    });

    this.getObservableUseProfile();
  

  }
/**
 * @param fileUpload
 * @param progress
 */
 
  pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }) {
    return new Promise((resolve,reject) =>{

      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);
   
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // in progress
          const snap = snapshot as firebase.storage.UploadTaskSnapshot;
          progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        },
        (error) => {
          // fail
          console.log(error);
        },
        () => {
          // success
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload);
            this.imgUrl= downloadURL;
            // console.log('service imageURl ' +this.imgUrl);
            // console.log('service imageURl ' + fileUpload.url);
          });
        }
      );
      resolve();

    });
      
  }
 
  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload);
  }


  public getObservableUseProfile() {
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

  public getUserProfile() {
    return this.userProfile$;
  }

  addUserProfile(userProfile: UserProfile){
    this.useProfileCollection.add(userProfile);

  }


  updateProfile(updatedPeofile){
    this.userProfileDoc = this.afs.doc(`User Profile/${updatedPeofile.profileId}`);
    this.userProfileDoc.update(updatedPeofile);

  }
 
  // getFileUploads(numberItems): AngularFireList<FileUpload> {
  //   return this.db.list(this.basePath, ref =>
  //     ref.limitToLast(numberItems));
  // }
 
  // deleteFileUpload(fileUpload: FileUpload) {
  //   this.deleteFileDatabase(fileUpload.key)
  //     .then(() => {
  //       this.deleteFileStorage(fileUpload.name);
  //     })
  //     .catch(error => console.log(error));
  // }
 
  // private deleteFileDatabase(key: string) {
  //   return this.db.list(`${this.basePath}/`).remove(key);
  // }
 
  // private deleteFileStorage(name: string) {
  //   const storageRef = firebase.storage().ref();
  //   storageRef.child(`${this.basePath}/${name}`).delete();
  // }
}