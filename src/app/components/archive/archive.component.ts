import { Archive } from './../../Models/Archive';
import { TasksOperationService } from './../../services/tasks-operation.service';
import { AuthService } from './../../services/auth.service';
import { TasksDisplayService } from './../../services/tasks-display.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
 archives : Archive[];
 archive: Archive;

  public currentUID: string = localStorage.getItem("LoggedInUserID");
  
  constructor(public authService: AuthService, public tasksDisplayService: TasksDisplayService, public tasksOPeratiionsService: TasksOperationService) { }

  ngOnInit() {
    // this.currentUID
    this.tasksDisplayService.filterArchieveByUID(this.currentUID);

    this.tasksDisplayService.getObservableArchive().subscribe(archives => {
      this.archives = archives;
    });
  }

}
