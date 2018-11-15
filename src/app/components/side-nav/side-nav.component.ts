import { TodayTask } from './../../Models/TodayTask';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HostListener } from "@angular/core";
import { MatDialog } from '@angular/material';

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';
import { HomePageComponent } from '../home-page/home-page.component';
import { UserProfile } from '../../Models/user-profile';
import { UploadFileService } from '../../services/upload-file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})

export class SideNavComponent implements OnInit {

  // ============================= Properties ============================= //

  // ----- Initialize userProfile and userProfiles array ----- //
  userProfiles: UserProfile[];
  userProfile: UserProfile = {
    profileId: '',
    UID: '',
    displayName: '',
    imageUrl: '',
    status: '',
  }


  // ----- Initialize list and lists array ----- //
  lists: List[];
  list: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  // ----- Initialize def list and def lists array ----- //
  defLists: List[];
  defList: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  // ----- Initialize task and tasks array ----- //
  tasks: Task[] = [];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }

  todayTasks: TodayTask[] = [];
  todayTask: TodayTask = {
    taskId: '',
    taskName: '',
    dayDate: new Date,
    completed: false,
    defListRef: '',
    originalListRef: '',
    originalListName: '',
    UID: '',
  }


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



  // Fetch current UID and EMAIL from locaLStorage 
  public currentUID: string;
  public currentUserEmail: string;

  // Declare current List, its name and its id
  public currentList: List;


  isMyDay: boolean = true;
  isActive: boolean = true;

  isMobileView: boolean = false;
  screenHeight: number;
  screenWidth: number;
  rename: boolean = false;

  // ============================= Functions ============================= //

  /**
   * constructor function
   * @param uploadService 
   * @param tasksDisplayService 
   * @param authService 
   * @param tasksOperationService 
   * @param dialog 
   */
  constructor(
    public authService: AuthService,
    public tasksDisplayService: TasksDisplayService,
    public tasksOperationService: TasksOperationService,
    public uploadService: UploadFileService,
    public dialog: MatDialog,
    public router: Router) { }

  /**
   * ngOnInit function
   */
  ngOnInit() {


    if (localStorage.getItem("LoggedInUserID") !== null) {
      this.currentUID = localStorage.getItem("LoggedInUserID");
      this.currentUserEmail = localStorage.getItem("LoggedInUserEmail");
    } else {
      this.currentUID = sessionStorage.getItem("LoggedInUserID");
      this.currentUserEmail = sessionStorage.getItem("LoggedInUserEmail");
    }

    // filter user profile based on user id 
    this.uploadService.filterProfileByUID(this.currentUID);

    this.uploadService.getObservableUserProfile().subscribe(userProfiles => {
      this.userProfiles = userProfiles;
      this.userProfile = this.userProfiles[0];
    });

    // filter lists based on user id 
    this.tasksDisplayService.filterListsByUID(this.currentUID);

    this.tasksDisplayService.getObservableLists().subscribe(lists => {
      this.lists = lists;
    });

    // filter defLists based on user id AND todayTAsks based on ddefault list id
    this.tasksDisplayService.filterDefListsByUID(this.currentUID);

    this.tasksDisplayService.getObservableDefLists().subscribe(defLists => {
      this.defLists = defLists;
      this.defList = this.defLists[0]

      // to make chosen list by default is myDay list
      this.currentList = this.defList;

      this.tasksDisplayService.filterTodayTasksByDefListId(this.defList.listId);
      this.tasksDisplayService.getObservableTodayTasks().subscribe(todayTasks => {
        this.todayTasks = todayTasks;
      });

    });

    this.onResize();


  }


  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 630) {
      this.isMobileView = false;
    }
    else {
      this.isMobileView = true;

    }
  }
  /**
   * set currentList function
   * @param event 
   * @param list 
   */
  setCurrentList(event, list: List): void {
    //fetch currentList, name and id
    this.currentList = list;
    console.log("current list " +this.currentList.listName);

    //filter tasks based on list id
    this.tasksDisplayService.filterTasksByListId(this.currentList.listId);
    this.tasksDisplayService.getObservableTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  /**
   * add new list function
   */
  addNewList(): void {
    this.list = { listName: "Unitiled List ", UID: this.currentUID }
    this.tasksOperationService.addList(this.list);
  }

  deleteList(list: List) {
    this.tasksOperationService.deleteList(list);
  }
  
  /**
   * open dialog in home page 
   */
  @ViewChild('homePage') homePage: HomePageComponent;

  openDialog(): void {
    this.homePage.openDialog();
  }


  renameList() {
    this.tasksOperationService.updateList(this.currentList);
    this.isRename(false);

  }

  isRename(rename: boolean) {
    this.rename = rename;
  }
  /**
   * 
   */
  goToArchieve() {
    this.router.navigateByUrl('/archieve');
  }

  /**
   * 
   * logout
   */
  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login-page');
    }).catch((err) => {
      console.log(err);
    });
  }



}
