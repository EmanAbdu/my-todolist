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
  rename: boolean = false;

  lists$: Observable<List[]>;
  defLists$: Observable<List[]>
  tasks$: Observable<Task[]>;

  listCollection: AngularFirestoreCollection<List>;
  defListCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;

  listDoc: AngularFirestoreDocument<List>;
  defListDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;

  // ============================= Functions ============================= //

  /**
   * constructor function
   * @param afs 
   */
  constructor(public afs: AngularFirestore) { }

  /**
   * filter by uid fetched from local storage
   * @param uid 
   */
  filterByUID(uid: string | null): any {
    this.listCollection = this.afs.collection<List>('Lists', ref => {
      return ref.where('UID', '==', uid).orderBy('listName', 'asc');
    });

    this.defListCollection = this.afs.collection<List>('Default Lists', ref => {
      return ref.where('UID', '==', uid).orderBy('listName', 'asc');
    });

    this.getLists();
    this.getDefLists();

  }

  /**
   * getObservableLists function
   */
  public getLists() {
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

  /**
   * getObservableDefLists function
   */
  public getDefLists() {
    this.defLists$ = this.defListCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const defListData = a.payload.doc.data() as List;
          defListData.listId = a.payload.doc.id;
          return defListData;
        })
      })
    );
  }

  /**
  * This function will be used in side-nav component
  * @return Observable<List[]>
  */
  public getObservableLists(): Observable<List[]> {
    return this.lists$;
  }

  /**
   * This function will be used in side-nav component
   * @return Observable<List[]>
   */
  public getObservableDefLists(): Observable<List[]> {
    return this.defLists$;
  }

  /**
   * filter tasks depends on list id
   * @param listId 
   */
  filterByListId(listId: string | null): any {
    console.log("list Id "+listId)
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('listRef', '==', listId);
    });
    this.getTasks();
  }

/**
 * filter tasks depends on def list name
 * @param defListName 
 */
  filterByDefListName(defListName: string | null): any {
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('listName', '==', defListName);
    });
    this.getTasks();
  }

  /**
   * return tasks doc with id
   */
  public getTasks() {
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


  /**
   * This function will be used in side-nav component
   * @return Observable<Task[]>
   */
  public getObservableTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  /**
   * check if it should rename or not
   * @param rename
   */
  renameList(rename: boolean) {
    this.rename = rename;
  }


}
