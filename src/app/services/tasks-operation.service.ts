import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { List } from '../Models/List';
import { Task } from '../Models/Task';


@Injectable({
  providedIn: 'root'
})
export class TasksOperationService {

  lists$: Observable<List[]>;
  tasks$: Observable<Task[]>;

  listCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;

  listDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;

  constructor(public afs: AngularFirestore) {
    this.listCollection = this.afs.collection('Lists', ref => ref.orderBy('listName', 'asc'));
    this.taskCollection = this.afs.collection('Tasks', ref => ref.orderBy('taskName', 'asc'));

  }


  public addList(list: List) {
    this.listCollection.add(list);
  }

  public deleteList(list: List) {
    this.listDoc = this.afs.doc(`Lists/${list.listId}`);
    this.listDoc.delete();
  }

  public updateList(list: List) {
    this.listDoc = this.afs.doc(`Lists/${list.listId}`);
    console.log(this.listDoc);
    this.listDoc.update(list);
  }

  //-------------------------------- Task Functions -------------------------------- //


  public addTask(task: Task) {
    this.taskCollection.add(task);
  }

  public deleteTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.delete();
  }

  updateTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.update(task);
  }
}
