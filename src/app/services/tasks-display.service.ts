import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { List } from '../Models/List';
import { Task } from '../Models/Task';
import { TodayTask } from '../Models/TodayTask';
import { Archive } from './../Models/Archive';

@Injectable({
  providedIn: 'root'
})

export class TasksDisplayService {

  // ============================= Properties ============================= //
  lists$: Observable<List[]>;
  defLists$: Observable<List[]>
  tasks$: Observable<Task[]>;
  todayTasks$: Observable<TodayTask[]>;
  archives$: Observable<Archive[]>;

  listCollection: AngularFirestoreCollection<List>;
  defListCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;
  todayTaskCollection: AngularFirestoreCollection<TodayTask>;
  archiveCollection: AngularFirestoreCollection<Archive>;

  listDoc: AngularFirestoreDocument<List>;
  defListDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;
  todayTaskDoc: AngularFirestoreDocument<TodayTask>;
  archiveDoc: AngularFirestoreDocument<Archive>;

  rename: boolean = false;

  // ============================= Functions ============================= //
  /**
   * constructor function
   * @param afs 
   */
  constructor(public afs: AngularFirestore) { }

 // ================ Filters Functions ================ //
  /**
   * filter by uid fetched from local storage
   * @param uid 
   */
  public filterListsByUID(uid: string | null): any {
    this.listCollection = this.afs.collection<List>('Lists', ref => {
      return ref.where('UID', '==', uid).orderBy('listName', 'asc');
    });
    this.getLists();
  }

  /**
   * 
   * @param uid 
   */
  public filterDefListsByUID(uid: string | null): any {
    this.defListCollection = this.afs.collection<List>('Default Lists', ref => {
      return ref.where('UID', '==', uid).orderBy('listName', 'asc');
    });
    this.getDefLists();
  }

  /**
   * 
   * @param uid 
   */
  public filterTasksByUID(uid: string | null): any {
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('UID', '==', uid);
    });
    this.getTasks();
  }

  /**
   * 
   * @param uid 
   */
  public filterTodayTasksByUID(uid: string | null): any {
    this.todayTaskCollection = this.afs.collection<TodayTask>('TodayTasks', ref => {
      return ref.where('UID', '==', uid);
    });
    this.getTodayTasks();
  }

  /**
   * filter tasks depends on list id
   * @param listId 
   */
  public filterTasksByListId(listId: string | null): any {
    this.taskCollection = this.afs.collection<Task>('Tasks', ref => {
      return ref.where('listRef', '==', listId);
    });
    this.getTasks();
  }

/**
 * 
 * @param defListId 
 */
 public  filterTodayTasksByDefListId(defListId: string | null): any {
    // console.log("list Id " + listId)
    this.todayTaskCollection = this.afs.collection<TodayTask>('TodayTasks', ref => {
      return ref.where('defListRef', '==', defListId);
    });
    this.getTodayTasks();
  }

/**
 * 
 * @param uid 
 */
  public filterArchieveByUID(uid: string | null): any {

    this.archiveCollection = this.afs.collection<Archive>('Archive', ref => {
      return ref.where('UID', '==', uid).orderBy('archiveDate', 'asc');;
    });
    this.getArchives();
  }

   // ================ Get Functions ================ //
  /**
   * getObservableLists function
   */
  private getLists() {
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
  private getDefLists() {
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
 * 
 */
  private getTasks() {
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
   * 
   */
  private getTodayTasks() {
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

  /**
   * 
   */
  public getObservableTodayTasks(): Observable<TodayTask[]> {
    return this.todayTasks$;
  }

  /**
   * 
   */
  private getArchives() {
    this.archives$ = this.archiveCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const archiveData = a.payload.doc.data() as Archive;
          archiveData.archiveId = a.payload.doc.id;
          return archiveData;
        })
      })
    );
  }

  /**
   * 
   */
  public getObservableArchive(){
    return this.archives$;
  }


}
