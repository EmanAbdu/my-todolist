import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';

import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { RepeatingDialogComponent } from '../repeating-dialog/repeating-dialog.component';

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';
import { TodayTask } from './../../Models/TodayTask';
import { Archive } from './../../Models/Archive';
import { Monthdays } from './../../Models/Monthdays';
import { Weekdays } from './../../Models/Weekdays';

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

  currentUID: string;

  userTasks: Task[] = [];
  userTodayTasks: TodayTask[] = [];
  userTask: Task;
  userTodayTask: TodayTask;

  weekdays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
  months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

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
  totalTodayTasksNumber: number;
  checkdTasksNumber: number = 0;
  percentage: number = 0;

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

    this.getCurrentUserId();
    this.copyProperTasksToMyDay();
    setTimeout(() => {
      this.getTasksPercentage();
    }, 3000)

    // time watcher   
    setInterval(() => {
      let today = new Date();
      this.dd = today.getDate();
      this.mm = today.getMonth();  //January is 0!
      this.yyyy = today.getFullYear();
      this.day = today.getDay();
      this.hh = today.getHours();
      this.min = today.getMinutes();
      this.ss = today.getSeconds();
      if (this.hh == 1 && this.min == 57 && this.ss == 0) {
        this.moveToArchiveTasks();
      }
    }, 1000);

  }

  getCurrentUserId() {
    if (localStorage.getItem("LoggedInUserID") !== null) {
      this.currentUID = localStorage.getItem("LoggedInUserID");
    } else {
      this.currentUID = sessionStorage.getItem("LoggedInUserID");
    }
  }

  copyProperTasksToMyDay() {
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

        //check selected month and day 
        if (selectedYearDay == this.dd && selectedYearMonth == this.mm + 1) {
          movedTask = userTask;
        }
        //check if my day is empty
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
        //check if this task should be copied to my day
        if ((shouldCopied && movedTask != null)) {
          let myTask = {
            taskName: userTask.taskName, dayDate: new Date, completed: false, originalListRef: userTask.listRef, defListRef: this.defList.listId, originalListName: userTask.listName, UID: this.currentUID
          }
          this.tasksOperationService.addTodayTask(myTask);
        }
      });
    });
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
    this.tasksOperationService.addTodayTask(newTodayTask).then(() =>{
      newTaskName.value = null;
      this.getTasksPercentage();
    }).catch((err)=>{
      console.log(err);
    })
  
  }

  /**
   * 
   */
  moveToArchiveTasks() {
    this.getTasksPercentage();
    let newArchive: Archive = {
      archiveDate: new Date(), archiveTasks: this.userTodayTasks,
      tasksNum: this.userTodayTasks.length, checkedTasksNum: this.checkdTasksNumber, percentage: this.percentage, UID: this.currentUID,
    }
    this.tasksOperationService.moveToArchiveTasks(newArchive).then(() => {
      this.userTodayTasks.forEach(todayTask => {
        this.tasksOperationService.deleteTodayTask(todayTask);
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * 
   */
  public getTasksPercentage() {
    this.checkdTasksNumber=0;
    this.totalTodayTasksNumber = this.userTodayTasks.length;
    this.userTodayTasks.forEach(todayTask => {
      if (todayTask.completed) {
        this.checkdTasksNumber++;
      }
    })
    this.percentage = (this.checkdTasksNumber / this.totalTodayTasksNumber) * 100;
    console.log(" total checked task number " + this.checkdTasksNumber);
    console.log(" total today tasks " + this.totalTodayTasksNumber);
  }

  /**
   * 
   * @param currentTask 
   */
  deleteTask(currentTask: Task) {
    this.tasksOperationService.deleteTask(currentTask);

  }

  deleteTodayTask(todayTask: TodayTask) {
    this.tasksOperationService.deleteTodayTask(todayTask).then(()=>{
      this.getTasksPercentage();
    }).catch((err) =>{
      console.log(err);
    })

  }

  /**
   * 
   * @param currentTask 
   */
  checkTask(currentTask: Task) {
    this.tasksOperationService.checkTask(currentTask);
  }

  checkTodayTask(currentTodayTask: TodayTask) {
    this.tasksOperationService.checkTodayTask(currentTodayTask).then(()=>{
      this.getTasksPercentage();
    })
  

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