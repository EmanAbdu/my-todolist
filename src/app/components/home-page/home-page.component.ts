import { Component, OnInit, Input } from '@angular/core';

import { TasksDisplayService } from '../../services/tasks-display.service';
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

  @Input() public listName: string;
  @Input() public listId: string;
  @Input() public tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }

  
  IsListIdChanged: true;
  constructor(public tasksDisplayService: TasksDisplayService) { 
    

    // this.tasksService.filterByUID('TIS5DLwrkMMlwpxH0EOImlPuMrC3');

    // this.listCollection = this.afs.collection<List>('Lists', ref => {
    //   return ref.where('UID', '==', 'TIS5DLwrkMMlwpxH0EOImlPuMrC3')
    // });

    // this.lists$ = this.listCollection.valueChanges();
  }

  ngOnInit() {

      // this.currentListId = this.tasksService.currentListId;
      // this.tasksService.filterBylistID(this.currentListId);
      // console.log( " cuurent list id " + this.currentListId.toString() );
  
      this.tasksDisplayService.s_filterByUID('TIS5DLwrkMMlwpxH0EOImlPuMrC3');


    
    this.tasksDisplayService.getLists().subscribe(lists => {
      this.lists = lists;
    })

    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    })

  }

  filterByUID(uid:string) : any{
    this.lists =this.tasksDisplayService.s_filterByUID(uid);
  }


}
