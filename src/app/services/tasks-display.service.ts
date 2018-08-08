import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { List } from '../Models/List';
import { Task } from '../Models/Task';

@Injectable({
  providedIn: 'root'
})
export class TasksDisplayService {

  // ============================= Properties ============================= //
  lists$: Observable<List[]>;
  tasks$: Observable<Task[]>;

  listCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;

  listDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;

  // ============================= Functions ============================= //


  // ----- constructor ----- //
  constructor(public afs: AngularFirestore) { }

  // ----- Filter by UID ----- //
  s_filterByUID(uid: string | null): any {
    this.listCollection = this.afs.collection<List>('Lists', ref => {
      return ref.where('UID', '==', uid);
    });
    this.getObservableLists();
  }

  // ----- Filter by listID ----- //
  s_filterByListId(listId: string | null): any {
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('listRef', '==', listId);
    });
    this.getObservableTasks();
  }

  // ----- Get Observable Lists ----- //
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

  // ----- Get Observable Tasks ----- //
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

  // ----- Get Lists ----- //
  public getLists() {
    return this.lists$;
  }

  // ----- Get Tasks ----- //
  public getTasks() {
    return this.tasks$;
  }

  

}
