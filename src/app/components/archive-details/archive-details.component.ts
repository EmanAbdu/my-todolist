import { Archive } from './../../Models/Archive';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';



@Component({
  selector: 'app-archive-details',
  templateUrl: './archive-details.component.html',
  styleUrls: ['./archive-details.component.scss']
})
export class ArchiveDetailsComponent implements OnInit {

  archiveDate = this.data.archiveDate.toDate();
  archiveTasks = this.data.archiveTasks;
  constructor(public thisDialogRef: MatDialogRef<ArchiveDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: Archive, ) {

  }

  ngOnInit() {
  }

}
