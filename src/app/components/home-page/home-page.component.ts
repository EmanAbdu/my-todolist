
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';
import { TodayTask } from './../../Models/TodayTask';

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
  @Input() public todayTasks: TodayTask[];
  @Input() public list: List;
  @Input() public defList: List;
  @Input() public showOptions: boolean;




  lists: List[];
  task: Task = {
    taskId: '',
    taskName: '',
    completed: false,
    createdDate: new Date,
    listRef: '',
    listName:'',
    repeatingDays: [{ dayId: 0, dayName: "Sunday", selected: false }],
    moveInDay: new Date(),
    UID: ''
  }

  // todayTasks: TodayTask[];
  todayTask: TodayTask = {
    taskId: '',
    taskName: '',
    dayDate: new Date,
    completed: false,
    defListRef:'',
    originalListRef:'',
    originalListName:'',
    UID:'',
  }

  public currentUID: string = localStorage.getItem("LoggedInUserID");

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
  // hh:number;
  // min:number;
  // ss:number;

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
    // console.log("time in 24 hours: " + this.today.toLocaleString('en-US', options));

    // this.tasksDisplayService.hhCast.subscribe(hh => this.hh=hh);
    // this.tasksDisplayService.minCast.subscribe(min => this.min=min);
    // this.tasksDisplayService.ssCast.subscribe(ss => this.ss=ss);
    // setInterval(()=>{
    //   // this.ss = this.today.getSeconds();
    // this.tasksDisplayService.ssCast.subscribe(ss => {
    //   this.ss=ss;
    //   console.log("second "+ ss);
    // }
    // )}, 2000);



    setInterval(() => {
      // this.ss = this.today.getSeconds();
      let today = new Date();

      this.dd = today.getDate();
      this.mm = today.getMonth();  //January is 0!
      this.yyyy = today.getFullYear();
      this.day = today.getDay();
      this.hh = today.getHours();
      this.min = today.getMinutes();
      this.ss = today.getSeconds();

      if (this.min == 45) {
        console.log("emnan")
      }
      // console.log("second "+ this.ss);
    }, 1000);

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
    this.task = {
      taskName: newTaskName.value, completed: false, listRef: this.list.listId, listName: this.list.listName,UID: this.currentUID, createdDate: new Date, moveInDay: new Date(), repeatingDays: [
        { dayId: 0, dayName: "Sunday", selected: false }, { dayId: 1, dayName: "Monday", selected: false },
        { dayId: 2, dayName: "Tuesday", selected: false }, { dayId: 3, dayName: "Wednesday", selected: false },
        { dayId: 4, dayName: "Thursday", selected: false }, { dayId: 5, dayName: "Friday", selected: false },
        { dayId: 6, dayName: "Saturday", selected: false },
      ]
    }
    this.tasksOperationService.addTask(this.task);
    newTaskName.value = null;
  }


  addNewTodayTask(newTaskName){
    this.todayTask={
      taskName: newTaskName.value, dayDate: new Date,  completed: false, originalListRef: this.list.listId, defListRef:this.list.listId, originalListName: this.list.listName, UID: this.currentUID
    }
    this.tasksOperationService.addTodayTask(this.todayTask);
    newTaskName.value = null;
  }

  /**
   * 
   * @param currentTask 
   */
  deleteTask(currentTask: Task) {
    this.tasksOperationService.deleteTask(currentTask);

  }

  deleteTodayTask(todayTask: TodayTask) {
    // console.log("deleted Task is" + todayTask.taskName)
    this.tasksOperationService.deleteTodayTask(todayTask);

  }

  /**
   * 
   * @param currentTask 
   */
  checkTask(currentTask: Task) {
    this.tasksOperationService.checkTask(currentTask);

  }

  checkTodayTask(currentTodayTask: TodayTask) {
    this.tasksOperationService.checkTodayTask(currentTodayTask);

  }

  /**
   * open update Profile dialog
   */
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '80%';
    dialogConfig.closeOnNavigation = true;
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