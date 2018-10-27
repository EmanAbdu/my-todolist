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

  // ============================= Properties ============================= //
  @Input() public currentList: List; //choosed list by the user
  @Input() public defList: List;
  @Input() public tasks: Task[]; //tasks appear depending on chosing list on the side-nav
  @Input() public todayTasks: TodayTask[]; // today tasks will appear when chosing myDay list
  @Input() public isMyDay: boolean;


  // ----- Initialize def list and def lists array ----- //
  userDefLists: List[];
  userDefList: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  userTasks: Task[];
  userTask: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    UID: ''
  }

  userTodayTasks: TodayTask[];
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

  weekday = this.weekdays[this.day]; // display it in html
  yearMonth = this.yearMonths[this.mm]; //display it in html
  taskMoveInDay: any;

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

    let date = new Date();

    this.tasksDisplayService.filterTodayTasksByUID(this.currentUID);
    this.tasksDisplayService.getObservableTodayTasks().subscribe(userTodayTasks => {
      this.userTodayTasks = userTodayTasks;

    });

    this.tasksDisplayService.filterTasksByUID(this.currentUID);
    this.tasksDisplayService.getObservableTasks().subscribe(userTasks => {
      this.userTasks = userTasks;

      for (let i = 0; i < this.userTasks.length; i++) {

        // }
        let shouldCopied: boolean = false;
        let movedTask = null;

        let taskRepeatingWeeklyDays: Weekdays[] = this.userTasks[i].repeatingWeeklyDays;
        let taskRepeatingMonthlyDays: Monthdays[] = this.userTasks[i].repeatingMonthlyDays;

        let selectedYearDay: number = this.userTasks[i].yearlyDay;
        let selectedYearMonth: number = this.userTasks[i].yearlyMonth;

        //looping through repeating WEEKLY days
        for (let j = 0; j < taskRepeatingWeeklyDays.length; j++) {
          if (taskRepeatingWeeklyDays[j].selected && taskRepeatingWeeklyDays[j].dayId == date.getDay()) {
            movedTask = this.userTasks[i];
            break;
          }
        }

        // looping through repeating MONTHLY days
        for (let j = 0; j < taskRepeatingMonthlyDays.length; j++) {
          if (taskRepeatingMonthlyDays[j].selected && taskRepeatingMonthlyDays[j].dayId == date.getDate()) {
            movedTask = this.userTasks[i];
            break;
          }
        }

        if (this.userTasks[i].moveInDay != null) {
          this.taskMoveInDay = this.userTasks[i].moveInDay.toDate();
          if (this.taskMoveInDay.getDate() == date.getDate() && this.taskMoveInDay.getMonth() == date.getMonth() && this.taskMoveInDay.getFullYear() == date.getFullYear()) {
            movedTask = this.userTasks[i];
          }
        }

        else if (selectedYearMonth == date.getMonth() + 1 && selectedYearDay == date.getDate()) {
          movedTask = this.userTasks[i];
        }

        else if (this.userTasks[i].isDaily) {
          movedTask = this.userTasks[i];
        }

        //looping through TODAY TASKS
        for (let x = 0; x < this.userTodayTasks.length; x++) {
          if (this.userTodayTasks[x].taskName == this.userTasks[i].taskName) {
            shouldCopied = false;
            break;
          }
          else {
            shouldCopied = true;
          }
        }

        if ((shouldCopied && movedTask != null)) {

          let myTask = {
            taskName: this.userTasks[i].taskName, dayDate: new Date, completed: false, originalListRef: this.userTasks[i].listRef, defListRef: this.defList.listId, originalListName: this.userTasks[i].listName, UID: this.currentUID

          }
          this.tasksOperationService.addTodayTask(myTask);
          // debugger
        }
        // debugger

      }

    });
    // debugger






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
      taskName: newTaskName.value, completed: false, listRef: this.currentList.listId, listName: this.currentList.listName, UID: this.currentUID, createdDate: new Date, moveInDay: null, repeatingWeeklyDays: [
        { dayId: 0, dayName: "Sunday", selected: false }, { dayId: 1, dayName: "Monday", selected: false },
        { dayId: 2, dayName: "Tuesday", selected: false }, { dayId: 3, dayName: "Wednesday", selected: false },
        { dayId: 4, dayName: "Thursday", selected: false }, { dayId: 5, dayName: "Friday", selected: false },
        { dayId: 6, dayName: "Saturday", selected: false },
      ],
      repeatingMonthlyDays: [
        { dayId: 1, selected: false }, { dayId: 2, selected: false }, { dayId: 3, selected: false },
        { dayId: 4, selected: false }, { dayId: 5, selected: false }, { dayId: 6, selected: false }, { dayId: 7, selected: false },
        { dayId: 8, selected: false }, { dayId: 9, selected: false }, { dayId: 10, selected: false }, { dayId: 11, selected: false },
        { dayId: 12, selected: false }, { dayId: 13, selected: false }, { dayId: 14, selected: false }, { dayId: 15, selected: false },
        { dayId: 16, selected: false }, { dayId: 17, selected: false }, { dayId: 18, selected: false }, { dayId: 19, selected: false },
        { dayId: 20, selected: false }, { dayId: 21, selected: false }, { dayId: 22, selected: false }, { dayId: 23, selected: false },
        { dayId: 24, selected: false }, { dayId: 25, selected: false }, { dayId: 26, selected: false }, { dayId: 27, selected: false },
        { dayId: 28, selected: false }, { dayId: 29, selected: false }, { dayId: 30, selected: false }, { dayId: 31, selected: false }
      ],
      repeatingYearly: '0-0',
      yearlyDay:0,
      yearlyMonth:0,
      isDaily: false,
      selectedRepeatingOption: '--'
    }
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