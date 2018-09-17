import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';
import { HomePageComponent } from '../home-page/home-page.component';
import { UserProfile } from '../../Models/user-profile';
import { UploadFileService } from '../../services/upload-file.service';

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
  tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }



  // Fetch current UID from auth service --> to filter the lists and to add list under current user id  
  public currentUID: string = localStorage.getItem("LoggedInUserID");
  public currentUserEmail: string = localStorage.getItem("LoggedInUserEmail");

  // Declare current List, its name and its id
  public currentList: List;
  public currentListId: string;
  public currentListName: string;

  showOptions: boolean = false;
  isActive: boolean = true;



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
    public uploadService: UploadFileService,
    public tasksDisplayService: TasksDisplayService,
    public authService: AuthService,
    public tasksOperationService: TasksOperationService,
    public dialog: MatDialog) { }

  /**
   * ngOnInit function
   */
  ngOnInit() {

    // filter user profile based on user id 
    this.uploadService.filterByUID(this.currentUID);
    console.log("current User ID is:" + this.currentUID)
    // 3- Display filered lists 
    this.uploadService.getUserProfile().subscribe(userProfiles => {
      this.userProfiles = userProfiles;
      this.userProfile = this.userProfiles[0];
    });

    // filter lists based on user id 
    this.tasksDisplayService.filterByUID(this.currentUID);

    this.tasksDisplayService.getObservableLists().subscribe(lists => {
      this.lists = lists;
    });

    this.tasksDisplayService.getObservableDefLists().subscribe(defLists => {
      this.defLists = defLists;
      this.defList = this.defLists[0]

      this.currentList = this.defList;
      this.currentListName = this.currentList.listName;
      this.currentListId = this.currentList.listId;

      //filter tasks base on def list id 
      this.tasksDisplayService.filterByListId(this.currentListId);
      this.tasksDisplayService.getObservableTasks().subscribe(tasks => {
        this.tasks = tasks;
      });
    });


  }

  /**
   * set currentList function
   * @param event 
   * @param list 
   */
  setCurrentList(event, list: List): void {

    //fetch currentList, name and id
    this.currentList = list;
    this.currentListName = this.currentList.listName;
    this.currentListId = this.currentList.listId;

    //filter tasks based on list id
    this.tasksDisplayService.filterByListId(this.currentListId);
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
   * logout
   */
  logout(): void {
    this.authService.logout();
  }



}
