import { Component, OnInit } from '@angular/core';

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';

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
  public currentListId: string = '';
  public currentListName: string = ';'
  untitledListCounter: number = 0;

  constructor(public tasksDisplayService: TasksDisplayService, public authService: AuthService, public tasksOperationService: TasksOperationService) { }

  ngOnInit() {

    // Filter lists by user id 
    this.currentUID = this.authService.s_currentUID;
    this.tasksDisplayService.s_filterByUID(this.currentUID);
    
    this.tasksDisplayService.getLists().subscribe(lists => {
      this.lists = lists;
    });
    
    // filter tasks by list id  
    this.tasksDisplayService.s_filterByListId('gKlml7F0fqPeg77WBqgK');

    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    })
  }


  filterByListId(event, list: List) {

    this.currentListId = list.listId;
    console.log('listID on button pressed: ' + this.currentListId);
    this.tasksDisplayService.s_filterByListId(this.currentListId);


    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
    this.currentListName=this.list.listName;

  }

  addNewList() {
    this.currentUID = this.authService.s_currentUID;
    this.untitledListCounter++;
    this.list.listName = "Unitiled List " + this.untitledListCounter;
    this.list.UID = this.currentUID;
    this.currentListName=this.list.listName;


    this.tasksOperationService.addList(this.list);
  }


  // changePageIndex(pgIndex: number) {
  //   this.pageIndex = pgIndex;

  // }

}
