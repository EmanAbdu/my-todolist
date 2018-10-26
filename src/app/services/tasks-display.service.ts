import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { List } from '../Models/List';
import { Task } from '../Models/Task';
import { TodayTask } from '../Models/TodayTask';

@Injectable({
  providedIn: 'root'
})

export class TasksDisplayService {

  // ============================= Properties ============================= //

  lists$: Observable<List[]>;
  defLists$: Observable<List[]>
  tasks$: Observable<Task[]>;
  todayTasks$: Observable<TodayTask[]>;

  listCollection: AngularFirestoreCollection<List>;
  defListCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;
  todayTaskCollection: AngularFirestoreCollection<TodayTask>;

  listDoc: AngularFirestoreDocument<List>;
  defListDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;
  todayTaskDoc: AngularFirestoreDocument<TodayTask>;

  rename: boolean = false;
  today = new Date();
  hh = new BehaviorSubject<number>(this.today.getHours());
  hhCast = this.hh.asObservable();
  min = new BehaviorSubject<number>(this.today.getMinutes());
  minCast = this.min.asObservable();
  ss = new BehaviorSubject<number>(this.today.getSeconds());
  ssCast = this.ss.asObservable();

  // ============================= Functions ============================= //

  /**
   * constructor function
   * @param afs 
   */
  constructor(public afs: AngularFirestore) {

    this.hh.next(this.today.getHours());
    this.min.next(this.today.getMinutes());
    this.ss.next(this.today.getSeconds());

  }

  /**
   * filter by uid fetched from local storage
   * @param uid 
   */
  filterListsByUID(uid: string | null): any {
    this.listCollection = this.afs.collection<List>('Lists', ref => {
      return ref.where('UID', '==', uid).orderBy('listName', 'asc');
    });

    this.getLists();

  }

  filterDefListsByUID(uid: string | null): any {
    this.defListCollection = this.afs.collection<List>('Default Lists', ref => {
      return ref.where('UID', '==', uid).orderBy('listName', 'asc');
    });

    this.getDefLists();
  }

  filterTasksByUID(uid: string | null): any {
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('UID', '==', uid);
    });
    this.getTasks();
  }

  filterTodayTasksByUID(uid: string | null): any {
    this.todayTaskCollection = this.afs.collection<TodayTask>('TodayTasks', ref => {
      return ref.where('UID', '==', uid);
    });
    this.getTodayTasks();
  }

  /**
   * filter tasks depends on list id
   * @param listId 
   */
  filterTasksByListId(listId: string | null): any {
    // console.log("list Id " + listId)
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('listRef', '==', listId);
    });
    this.getTasks();
  }


  filterTodayTasksByDefListId(defListId: string | null): any {
    // console.log("list Id " + listId)
    this.todayTaskCollection = this.afs.collection<TodayTask>('TodayTasks', ref => {
      return ref.where('defListRef', '==', defListId);
    });
    this.getTodayTasks();
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

  

  // filterByDefListName(defListName: string | null): any {
  //   this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
  //     return ref.where('listName', '==', defListName);
  //   });
  //   this.getTasks();
  // }

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

  public getTodayTasks() {
    this.todayTasks$ = this.todayTaskCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const todayTaskData = a.payload.doc.data() as TodayTask;
          todayTaskData.taskId = a.payload.doc.id;
          return todayTaskData;
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
  public getObservableTodayTasks(): Observable<TodayTask[]> {
    return this.todayTasks$;
  }

}
