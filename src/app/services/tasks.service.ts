import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { List } from '../Models/List';
import { Task } from '../Models/Task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  lists$: Observable<List[]>;
  tasks$: Observable<Task[]>;

  listCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;

  listDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;

  //---------------------------------- constructor ----------------------------------//
  constructor(public afs: AngularFirestore) {

    // ---------------- Return listData ---------------- //
    this.listCollection = this.afs.collection('Lists', ref => ref.orderBy('listName', 'asc'));
    this.getObservableLists();

    //---------------- Return taskData ---------------- //
    this.taskCollection = this.afs.collection('Tasks', ref => ref.orderBy('taskName', 'asc'));
    this.getObservableTasks();
  }

  public getObservableLists() {
    this.lists$ = this.listCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const listData = a.payload.doc.data() as List;
          listData.listId = a.payload.doc.id;
          return listData;
        })
      })
    );

  }

  //-------------------------------- Get Observable Tasks -------------------------------- //
  public getObservableTasks() {
    this.tasks$ = this.taskCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const taskData = a.payload.doc.data() as Task;
          taskData.taskId = a.payload.doc.id;
          return taskData;
        })
      })
    );

  }

  //-------------------------------- List Functions -------------------------------- //
  public getLists() {
    return this.lists$;
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
  public getTasks() {
    return this.tasks$;
  }

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

  //-------------------------------- Filter by UID -------------------------------- //
  filterByUID(uid: string | null): any {
    this.listCollection = this.afs.collection<List>('Lists', ref => {
      return ref.where('UID', '==', uid);
    });
    // this.lists$ =this.listCollection.valueChanges();
    this.getObservableLists();
  }

  //-------------------------------- Filter by listID -------------------------------- //
  filterBylistID(listId: string | null): any {

    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('listRef', '==', listId);
    });
    // this.tasks$ =this.taskCollection.valueChanges();
    this.getObservableTasks();
  }
  //-------------------------------- Get Observable Lists -------------------------------- //


}
