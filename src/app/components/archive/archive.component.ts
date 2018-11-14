import { ArchiveDetailsComponent } from './../archive-details/archive-details.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Archive } from './../../Models/Archive';
import { TasksOperationService } from './../../services/tasks-operation.service';
import { AuthService } from './../../services/auth.service';
import { TasksDisplayService } from './../../services/tasks-display.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  archives: Archive[];
  archive: Archive;

  public currentUID: string;
  dialogResult="";

  constructor(
    public authService: AuthService,
    public tasksDisplayService: TasksDisplayService,
    public tasksOPeratiionsService: TasksOperationService,
    public router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {

    if (localStorage.getItem("LoggedInUserID") !== null) {
      this.currentUID = localStorage.getItem("LoggedInUserID");
    } else {
      this.currentUID = sessionStorage.getItem("LoggedInUserID");
    }

    // this.currentUID
    this.tasksDisplayService.filterArchieveByUID(this.currentUID);

    this.tasksDisplayService.getObservableArchive().subscribe(archives => {
      this.archives = archives;
    });
  }
  openArchiveDetails(archive: Archive) {
    let dialogRef = this.dialog.open(ArchiveDetailsComponent, {
      width: '600px',
      data: archive//'This text is passed in to dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    })
  }



  backToTheTasks() {
    this.router.navigateByUrl('/side-nav');

  }



}
