import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../services/auth.service';

import { UploadFileService } from '../../services/upload-file.service';
import { FileUpload } from '../../Models/upload-files'
import { UserProfile } from '../../Models/user-profile';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {

  userProfiles: UserProfile[];
  userProfile: UserProfile = {
    profileId: '',
    UID: '',
    displayName: '',
    imageUrl: '',
    status: '',

  }

  // userProfile
  // public currentUser = this.authService.s_currentUser;
  public currentUID: string = this.authService.s_currentUID;
  public currentUserEmail: string = this.authService.s_currentUserEmail;

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };
  imgUrl: string;





  constructor(public thisDialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public authService: AuthService, public uploadService: UploadFileService) {

  }


  ngOnInit() {
    console.log(this.currentUID);
    this.uploadService.filterByUID(this.currentUID);
    console.log("current User ID is:" + this.currentUID)
    // 3- Display filered lists 
    this.uploadService.getUserProfile().subscribe(userProfiles => {
      this.userProfiles = userProfiles;
      this.userProfile = this.userProfiles[0];
    });

  }

  selectFile(event) {
    const file = event.target.files.item(0);

    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
    } else {
      alert('invalid format!');
    }
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.progress);
    // this.imgUrl=this.uploadService.imgUrl;
    setTimeout(() =>{
     this.userProfile.imageUrl=this.uploadService.imgUrl;
  }, 3000);
  }


  close() {
    this.thisDialogRef.close('Cancel');

  }


  save(profileUpdate: UserProfile) {
    this.thisDialogRef.close('Confirm');
    this.uploadService.updateProfile(profileUpdate);

  }
}
