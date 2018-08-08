import { Component, OnInit } from '@angular/core';

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';

import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  lists: List[];
  list: List = {
    listId: '',
    listName: '',
    UID: '',
  }


  tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }

  public pageIndex: number = 1;
  public currentUID: string;
  public currentListId = '';
  untitledListCounter: number = 0;

  constructor(public tasksService: TasksService, public authService: AuthService) { }

  ngOnInit() {

    this.currentUID = this.authService.currentUser;

    this.tasksService.filterByUID(this.currentUID);
    this.tasksService.filterBylistID('gKlml7F0fqPeg77WBqgK');


    this.tasksService.getLists().subscribe(lists => {
      this.lists = lists;
    });

    console.log(this.currentUID);

    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    })
  }


  filterByListId(event, list: List) {

    this.currentListId = list.listId;
    console.log('listID on button pressed: ' + this.currentListId);
    this.tasksService.filterBylistID(this.currentListId);


    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });

  }

  AddNewList() {
    this.currentUID = this.authService.currentUser;
    this.untitledListCounter++;
    this.list.listName = "Unitiled List " + this.untitledListCounter;
    this.list.UID = this.currentUID;

    this.tasksService.addList(this.list);
  }


  // changePageIndex(pgIndex: number) {
  //   this.pageIndex = pgIndex;

  // }

}
