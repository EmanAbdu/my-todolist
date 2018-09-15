import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { List } from '../../Models/List';
import { Task } from '../../Models/Task';

import { AuthService } from '../../services/auth.service';
import { TasksDisplayService } from '../../services/tasks-display.service';
import { TasksOperationService } from '../../services/tasks-operation.service';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})

export class SideNavComponent implements OnInit {

  // ================================================ Properties ================================================ //

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


  // 1- Fetch current UID from auth service --> to filter the lists and to add list under current user id  
  public currentUID: string = localStorage.getItem("LoggedInUserID");
  public currentUserEmail: string = localStorage.getItem("LoggedInUserEmail");
  // Declare current List, its name and its id
  public currentList: List;
  public currentListId: string;
  public currentListName: string;

  // Declare May Day List 
  myDayList: string;
  showOptions: boolean = false;
  isActive: boolean = true;
  dialogResult;



  // ================================================ Functions ================================================ //

  // ----- constructor ----- //
  constructor(public tasksDisplayService: TasksDisplayService, public authService: AuthService, public tasksOperationService: TasksOperationService, public dialog: MatDialog) { }

  // ----- getOnInit: Display List Based on UID ----- //
  ngOnInit() {

    // 2- Filter lists by UID
    this.tasksDisplayService.s_filterByUID(this.currentUID);
    // 3- Display filered lists 
    this.tasksDisplayService.getLists().subscribe(lists => {
      this.lists = lists;
    });

    this.tasksDisplayService.getDefLists().subscribe(defLists => {
      this.defLists = defLists;
    });



    //filter tasks by list id  
    this.tasksDisplayService.s_filterByListId('PChJbRwvCGZ3zSGpMD4l');

    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });

  }

  //----- Get current list ----- //
  getCurrentList(event, list: List) {

    // 1- Fetch current list
    this.currentList = list;
    // 2- Fetch list Name to represent it in the head of  Home Page 
    this.currentListName = this.currentList.listName;
    // 3- Fetch list Id to filter the Tasks
    this.currentListId = this.currentList.listId;
    this.tasksDisplayService.s_filterByListId(this.currentListId);
    // 4- Display tasks in the Home Page
    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;

    });



  }

  //----- Add new list ----- //
  addNewList() {

    // Create new list and add it  onthe following three steps 
    this.list = { listName: "Unitiled List ", UID: this.currentUID }
    this.tasksOperationService.addList(this.list);

  }

  @ViewChild('homePage') homePage: HomePageComponent;

  openDialog() {
    this.homePage.openDialog();
  }

  logout() {
    this.authService.logout();
  }

  // isRrename(rename:boolean){
  //   this.tasksDisplayService.s_rename(rename);
  //   this.rename= this.tasksDisplayService.rename;
  //    console.log("isRename: " + this.rename)
  // }


}
