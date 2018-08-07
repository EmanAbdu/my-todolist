import { Component, OnInit } from '@angular/core';

import { List } from '../../Models/List';

import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  lists: List[];
  list: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  public pageIndex: number = 1;
  public currentUID: string;

  constructor(public tasksService: TasksService, public authService: AuthService) { }

  ngOnInit() {

    this.currentUID = this.authService.currentUser;

    this.tasksService.filterByUID(this.currentUID);


    this.tasksService.getLists().subscribe(lists => {
      this.lists = lists;
    });

    console.log(this.currentUID);

  }


  getListID(event, list: List){
   
    this.tasksService.getListID(list);
  }

  
  // changePageIndex(pgIndex: number) {
  //   this.pageIndex = pgIndex;

  // }

}
