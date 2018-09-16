import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';

import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {

  // ============================= Properties ============================= //
  @Input() public listName: string;
  @Input() public tasks: Task[];
  @Input() public list: List;
  @Input() public showOptions: boolean;


  lists: List[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }

  rename: boolean = false;
  IsListIdChanged: boolean = true;

  // ============================= Functions ============================= //

  /**
   * constructor function
   * @param tasksDisplayService 
   * @param authService 
   * @param tasksOperationService 
   * @param dialog 
   */
  constructor(
    public tasksDisplayService: TasksDisplayService,
    public authService: AuthService,
    public tasksOperationService: TasksOperationService,
    private dialog: MatDialog) { }

  /**
   * ngOnInit function
   */
  ngOnInit() { }

  /**
   * checking if the list will rename
   * @param rename 
   */
  isRename(rename: boolean) {

    this.tasksDisplayService.renameList(rename);
    this.rename = this.tasksDisplayService.rename;
  }

  renameList(listName: string) {

    let list = this.list;

    // this.list = { listName: listName, UID: this.authService.s_currentUID };
    // console.log(this.authService.s_currentUID);
    this.tasksOperationService.updateList(list);
    this.isRename(false);

  }

  deleteList(list: List) {
    this.tasksOperationService.deleteList(list);
  }

  addNewTask(newTaskName) {
    console.log(newTaskName);
    console.log(this.list.listId);
    this.task = { taskName: newTaskName.value, completed: false, listRef: this.list.listId }
    this.tasksOperationService.addTask(this.task);
    newTaskName.value = null;
  }

  deleteTask(currentTask: Task) {
    this.tasksOperationService.deleteTask(currentTask);
  }

  checkTask(currentTask: Task) {
    this.tasksOperationService.checkTask(currentTask);

  }

  /**
   * open update Profile dialog
   */
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '80%';
    dialogConfig.closeOnNavigation = false;
    this.dialog.open(EditProfileDialogComponent, dialogConfig);
  }
}




