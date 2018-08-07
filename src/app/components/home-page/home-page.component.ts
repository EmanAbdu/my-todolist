import { Component, OnInit } from '@angular/core';

import { TasksService } from '../../services/tasks.service';
import { List } from '../../Models/List';
import { Task } from '../../Models/Task';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  lists: List[];
  list: List = {
    listId: '',
    listName: '',
    UID: '',
  }


  tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }

  currentListID : string;
  constructor(public tasksService: TasksService) { 
    

    // this.tasksService.filterByUID('TIS5DLwrkMMlwpxH0EOImlPuMrC3');

    // this.listCollection = this.afs.collection<List>('Lists', ref => {
    //   return ref.where('UID', '==', 'TIS5DLwrkMMlwpxH0EOImlPuMrC3')
    // });

    // this.lists$ = this.listCollection.valueChanges();
  }

  ngOnInit() {

    if (this.currentListID !== ''){
    this.currentListID = this.tasksService.currentListId;
    this.tasksService.filterBylistID(this.currentListID);
    console.log( " cuurent list id " + this.currentListID.toString() );

    } else {
        console.log ('There sis no list id');
    }
    

    this.tasksService.filterByUID('TIS5DLwrkMMlwpxH0EOImlPuMrC3');


    
    this.tasksService.getLists().subscribe(lists => {
      this.lists = lists;
    })

    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    })

  }

  filterByUID(uid:string) : any{
    this.lists =this.tasksService.filterByUID(uid);
  }


}
