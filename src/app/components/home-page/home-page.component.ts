import { Component, OnInit, Input } from '@angular/core';

import { TasksDisplayService } from '../../services/tasks-display.service';
import { List } from '../../Models/List';
import { Task } from '../../Models/Task';
import { AuthService } from '../../services/auth.service';
import { TasksOperationService } from '../../services/tasks-operation.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  lists: List[];
  // list: List = {
  //   listId: '',
  //   listName: '',
  //   UID: '',
  // }


  @Input() public listName: string;
  @Input() public tasks: Task[];
  @Input() public list: List;
  @Input() public showOptions :boolean;
  // @Input() public rename: boolean;
  // rename: boolean =this.tasksDisplayService.rename;
  rename: boolean = false;
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }


  IsListIdChanged: boolean = true;
  constructor(public tasksDisplayService: TasksDisplayService, public authService: AuthService, public tasksOperationService: TasksOperationService) {


    // this.tasksService.filterByUID('TIS5DLwrkMMlwpxH0EOImlPuMrC3');

    // this.listCollection = this.afs.collection<List>('Lists', ref => {
    //   return ref.where('UID', '==', 'TIS5DLwrkMMlwpxH0EOImlPuMrC3')
    // });

    // this.lists$ = this.listCollection.valueChanges();
  }

  ngOnInit() {

    // this.currentListId = this.tasksService.currentListId;
    // this.tasksService.filterBylistID(this.currentListId);
    // console.log( " cuurent list id " + this.currentListId.toString() );

    this.tasksDisplayService.s_filterByUID('TIS5DLwrkMMlwpxH0EOImlPuMrC3');



    this.tasksDisplayService.getLists().subscribe(lists => {
      this.lists = lists;
    })

    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    })

  }

  filterByUID(uid: string): any {
    this.lists = this.tasksDisplayService.s_filterByUID(uid);
  }

  isRename(rename: boolean) {

    this.tasksDisplayService.s_rename(rename);
    this.rename = this.tasksDisplayService.rename;

  }

  renameList(listName: string) {

    let list =this.list;

    // this.list = { listName: listName, UID: this.authService.s_currentUID };
    // console.log(this.authService.s_currentUID);
    this.tasksOperationService.updateList(list);
    this.isRename(false);

  }

  deleteList(list:List){
    this.tasksOperationService.deleteList(list);
  }

  addNewTask(newTaskName){
    console.log(newTaskName);
    console.log(this.list.listId);
    this.task = { taskName: newTaskName.value , listRef: this.list.listId }
    this.tasksOperationService.addTask(this.task);
    newTaskName.value= null;
  }

  deleteTask(currentTask: Task){
    this.tasksOperationService.deleteTask(currentTask);
  }




}
