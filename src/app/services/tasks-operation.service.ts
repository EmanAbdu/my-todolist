import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { List } from '../Models/List';
import { Task } from '../Models/Task';
import { TasksDisplayService } from './tasks-display.service';


@Injectable({
  providedIn: 'root'
})
export class TasksOperationService {

  // ============================= Properties ============================= //
  isCompleted: boolean;

  tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }


  lists$: Observable<List[]>;
  tasks$: Observable<Task[]>;

  listCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;

  listDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;

  // ============================= Functions ============================= //

  // ----- constructor ----- //
  constructor(public afs: AngularFirestore, public tasksDisplayService: TasksDisplayService) {
    this.listCollection = this.afs.collection('Lists', ref => ref.orderBy('listName', 'asc'));
    this.taskCollection = this.afs.collection('Tasks', ref => ref.orderBy('taskName', 'asc'));


  }

  // ----------- Tasks Functions ----------- //

  // ----- Add New List ----- //
  public addList(list: List) {
    this.listCollection.add(list);
  }

  // ----- Delete Existing List ----- //
  public deleteList(list: List) {
    this.listDoc = this.afs.doc(`Lists/${list.listId}`);
    this.listDoc.delete();

    this.deleteRelatedTasks(list.listId);
  }

  // ----- Update Existing List ----- //
  public updateList(list: List) {
    this.listDoc = this.afs.doc(`Lists/${list.listId}`);
    console.log(this.listDoc);
    this.listDoc.update(list);
  }

  //-------------------------------- Tasks Functions -------------------------------- //

  // ----- Add New Task ----- //
  public addTask(task: Task) {
    this.taskCollection.add(task);
  }

  // ----- Delete Existing Task ----- //
  public deleteTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.delete();
  }

  // ----- Updating Existing Task ----- //
  updateTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.update(task);
  }

  public deleteRelatedTasks(listId: string) {

    // this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
    //   return ref.where('listRef', '==', listId);
    // });

    this.tasksDisplayService.filterByListId(listId);
    console.log("  my list id:" + listId)

    this.tasksDisplayService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.tasks.forEach(task => {
        console.log(task.taskName);
        this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
        this.taskDoc.delete();
      });
    });





    // this.taskDoc = this.afs.doc(`Tasks/${this.tasks}`);
    // this.taskDoc.delete();



  }


  checkTask(task: Task) {
    this.isCompleted=task.completed;
    console.log("completed "+ this.isCompleted);
    this.isCompleted= !this.isCompleted;
    console.log("completed now "+ this.isCompleted);

    let upadtedTask = { taskName: task.taskName , completed: this.isCompleted, listRef: task.listRef }

   
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);

    // console.log(this.listDoc);
    this.taskDoc.update(upadtedTask);

  }

}
