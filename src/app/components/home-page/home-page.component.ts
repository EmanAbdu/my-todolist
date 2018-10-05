
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';
import { Weekdays } from './../../Models/Weekdays';

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';

import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { RepeatingDialogComponent } from '../repeating-dialog/repeating-dialog.component';


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
  @Input() public defList: List;
  @Input() public showOptions: boolean;




  lists: List[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    repeatingDays: [{ dayId: 0, dayName: "Sunday", selected: false }],
  }

  rename: boolean = false;
  // isListDeleted: boolean = true;


  today = new Date();
  weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday");
  yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December");

  dd = this.today.getDate();
  mm = this.today.getMonth();  //January is 0!
  yyyy = this.today.getFullYear();
  day = this.today.getDay();
  hh = this.today.getHours();
  min = this.today.getMinutes();
  ss = this.today.getSeconds();

  weekday = this.weekdays[this.day];
  yearMonth = this.yearMonths[this.mm];

  dialogResult = "";

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
  ngOnInit() {
    var options = { hour12: false };
    console.log("time in 24 hours: " + this.today.toLocaleString('en-US', options));
  }

  /**
   * checking if the list will rename
   * @param rename 
   */
  isRename(rename: boolean) {
    this.rename = rename;
  }

  /**
   * rename list and set isRename to false 
   */
  renameList() {
    this.tasksOperationService.updateList(this.list);
    this.isRename(false);

  }

  /**
   * 
   * @param list 
   */
  deleteList(list: List) {
    this.tasksOperationService.deleteList(list);
  }

  /**
   * 
   * @param newTaskName 
   */
  addNewTask(newTaskName) {
    console.log(newTaskName);
    console.log(this.list.listId);
    this.task = { taskName: newTaskName.value, completed: false, listRef: this.list.listId, repeatingDays: [{ dayId: 0, dayName: "", selected: false }] }
    this.tasksOperationService.addTask(this.task);
    newTaskName.value = null;
  }

  /**
   * 
   * @param currentTask 
   */
  deleteTask(currentTask: Task) {
    this.tasksOperationService.deleteTask(currentTask);

  }

  /**
   * 
   * @param currentTask 
   */
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

  
  /**
   * openRepeatingDialog
   */
  // openRepeatingDialog(task:Task){
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = false;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.height = '80%';
  //   dialogConfig.closeOnNavigation = false;
  //   this.dialog.open(RepeatingDialogComponent, {
  //     width: '600px',
  //     data: task
  //   });
  // }

  openRepeatingDialog(task: Task) {

    console.log("task name is " + task.taskName);
    let dialogRef = this.dialog.open(RepeatingDialogComponent, {
      width: '600px',
      data: task//'This text is passed in to dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    })
  }
}