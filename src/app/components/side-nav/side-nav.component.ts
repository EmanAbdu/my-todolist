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




  // Fetch current UID and EMAIL from locaLStorage 
  public currentUID: string = localStorage.getItem("LoggedInUserID");
  public currentUserEmail: string = localStorage.getItem("LoggedInUserEmail");

  // Declare current List, its name and its id
  public currentList: List;


  isMyDay: boolean = true;
  isActive: boolean = true;

  isMobileView: boolean = false;
  screenHeight: number;
  screenWidth: number;


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

    // filter user profile based on user id 
    this.uploadService.filterProfileByUID(this.currentUID);

    this.uploadService.getUserProfile().subscribe(userProfiles => {
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

  /**
   * open dialog in home page 
   */
  @ViewChild('homePage') homePage: HomePageComponent;

  openDialog(): void {
    this.homePage.openDialog();
  }


  /**
   * 
   */

  goToArchieve(){
    this.router.navigateByUrl('/archieve');
  }
  /**
   * 
   * logout
   */
  logout(): void {
    this.authService.logout();
  }



}
