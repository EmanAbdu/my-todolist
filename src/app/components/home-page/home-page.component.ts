import { Monthdays } from './../../Models/Monthdays';
import { Weekdays } from './../../Models/Weekdays';

import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';
import { TodayTask } from './../../Models/TodayTask';

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

  //========================================================== Properties ========================================================== //
  @Input() public currentList: List; //choosed list by the user
  @Input() public defList: List;
  @Input() public tasks: Task[]; //tasks appear depending on chosing list on the side-nav
  @Input() public todayTasks: TodayTask[]; // today tasks will appear when chosing myDay list
  @Input() public isMyDay: boolean;

  userTasks: Task[] = [];
  userTask: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    UID: ''
  }

  userTodayTasks: TodayTask[] = [];
  userTodayTask: TodayTask = {
    taskId: '',
    taskName: '',
    dayDate: new Date,
    completed: false,
    defListRef: '',
    originalListRef: '',
    originalListName: '',
    UID: '',
  }

  public currentUID: string = localStorage.getItem("LoggedInUserID");

  // Time and Date variables
  weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday");

  months = new Array("January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December");

  //Show Date, Day and Time in home header 
  todayDate = new Date();

  day = this.todayDate.getDay();
  dd = this.todayDate.getDate();
  mm = this.todayDate.getMonth();  //January is 0!
  yyyy = this.todayDate.getFullYear();
  hh = this.todayDate.getHours();
  min = this.todayDate.getMinutes();
  ss = this.todayDate.getSeconds();

  weekday = this.weekdays[this.day]; // display it in html
  month = this.months[this.mm]; //display it in html

  taskMoveInDay: any;
  rename: boolean = false;
  dialogResult = "";

  //========================================================== Functions ========================================================== //
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

    this.tasksDisplayService.filterTodayTasksByUID(this.currentUID);
    this.tasksDisplayService.getObservableTodayTasks().subscribe(userTodayTasks => {
      this.userTodayTasks = userTodayTasks;

    });

    this.tasksDisplayService.filterTasksByUID(this.currentUID);
    this.tasksDisplayService.getObservableTasks().subscribe(userTasks => {
      this.userTasks = userTasks;


      this.userTasks.forEach(userTask => {

        let shouldCopied: boolean = false;
        let movedTask = null;

        let taskRepeatingWeeklyDays: Weekdays[] = userTask.repeatingWeeklyDays;

        let taskRepeatingMonthlyDays: Monthdays[] = userTask.repeatingMonthlyDays;

        let selectedYearDay: number = userTask.yearlyDay;
        let selectedYearMonth: number = userTask.yearlyMonth;

        //check if moveInDay != null 
        if (userTask.moveInDay != null) {
          this.taskMoveInDay = userTask.moveInDay.toDate();
          if (this.taskMoveInDay.getDate() == this.dd && this.taskMoveInDay.getMonth() == this.mm && this.taskMoveInDay.getFullYear() == this.yyyy) {
            movedTask = userTask;
          }
        }

        // check if the task is repeating every day
        if (userTask.isDaily) {
          movedTask = userTask;
        }

        // looping through repeating WEEKLY days
        if (userTask.repeatingWeeklyDays != []) {
          for (let i = 0; i < taskRepeatingWeeklyDays.length; i++) {
            if (taskRepeatingWeeklyDays[i].dayId == this.day) {
              movedTask = userTask;
              break;
            }
          }
        }

        // looping through repeating MONTHLY days
        if (userTask.repeatingMonthlyDays != []) {
          for (let i = 0; i < taskRepeatingMonthlyDays.length; i++) {
            if (taskRepeatingMonthlyDays[i].dayId == this.dd) {
              movedTask = userTask;
              break;
            }
          }
        }


        if (selectedYearDay == this.dd && selectedYearMonth == this.mm + 1) {
          movedTask = userTask;
        }


        if (this.userTodayTasks.length == 0) {
          shouldCopied = true;
        } else {
          //looping through TODAY TASKS tio check if the task should copied
          for (let x = 0; x < this.userTodayTasks.length; x++) {
            if (this.userTodayTasks[x].taskName == userTask.taskName) {
              shouldCopied = false;
              break;
            }
            else {
              shouldCopied = true;
            }
          }
        }

        if ((shouldCopied && movedTask != null)) {

          let myTask = {
            taskName: userTask.taskName, dayDate: new Date, completed: false, originalListRef: userTask.listRef, defListRef: this.defList.listId, originalListName: userTask.listName, UID: this.currentUID
          }

          this.tasksOperationService.addTodayTask(myTask);

        }

      });

    });

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

      if (this.hh == 23 && this.min == 23 && this.ss == 30) {
        console.log("emnan")
        console.log(" hh " + this.hh + " min " + this.min + " ss " + this.ss);
        this.todayTasks.forEach(todayTask => {

          this.tasksOperationService.deleteTodayTask(todayTask);

        });

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
    this.tasksOperationService.updateList(this.currentList);
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
    let newTask: Task = {
      taskName: newTaskName.value, completed: false, listRef: this.currentList.listId, listName: this.currentList.listName, UID: this.currentUID, createdDate: new Date, moveInDay: null, repeatingWeeklyDays: [],
      repeatingMonthlyDays: [], repeatingYearly: '0-0', yearlyDay: 0, yearlyMonth: 0, isDaily: false, selectedRepeatingOption: '--'
    };
    this.tasksOperationService.addTask(newTask);
    newTaskName.value = null;
  }


  addNewTodayTask(newTaskName) {
    let newTodayTask: TodayTask = {
      taskName: newTaskName.value, dayDate: new Date, completed: false, originalListRef: this.currentList.listId, defListRef: this.currentList.listId, originalListName: this.currentList.listName, UID: this.currentUID
    }
    this.tasksOperationService.addTodayTask(newTodayTask);
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

}