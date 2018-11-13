import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { AngularFireStorageModule } from 'angularfire2/storage';
import { snapshotChanges } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { TasksDisplayService } from './tasks-display.service';
import { Archive } from './../Models/Archive';
import { Weekdays } from './../Models/Weekdays';
import { Monthdays } from '../Models/Monthdays';
import { List } from '../Models/List';
import { Task } from '../Models/Task';
import { TodayTask } from '../Models/TodayTask';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class TasksOperationService {

  // ============================= Properties ============================= //
  userDefLists: List[];
  userDefList: List;

  userTasks: Task[];
  userTask: Task;

  userTodayTasks: TodayTask[];
  userTodayTask: TodayTask;

  archives: Archive[];
  archive: Archive;


  lists$: Observable<List[]>;
  defList$: Observable<List[]>;
  tasks$: Observable<Task[]>;
  todayTasks$: Observable<TodayTask[]>;
  archive$: Observable<Archive[]>;

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

  isCompleted: boolean;
  currentUID: string;

  // ============================= Functions ============================= //

  /**
   * 
   * @param afs 
   * @param tasksDisplayService 
   */
  constructor(public afs: AngularFirestore, public tasksDisplayService: TasksDisplayService) {

    this.listCollection = this.afs.collection('Lists', ref => ref.orderBy('listName', 'asc'));
    this.defListCollection = this.afs.collection('Default Lists', ref => ref.orderBy('listName', 'asc'));
    this.taskCollection = this.afs.collection('Tasks', ref => ref.orderBy('taskName', 'asc'));
    this.todayTaskCollection = this.afs.collection('TodayTasks', ref => ref.orderBy('taskName', 'asc'));
    this.archiveCollection = this.afs.collection('Archive', ref => ref.orderBy('archiveDate', 'asc'));
    // -----------------------------------------------------

    if (localStorage.getItem("LoggedInUserID") !== null) {
      this.currentUID = localStorage.getItem("LoggedInUserID");
    } else {
      this.currentUID = sessionStorage.getItem("LoggedInUserID");
    }
  }

  /**
   * 
   * @param list 
   */
  public addList(list: List) {
    this.listCollection.add(list);
  }

  /**
   * 
   * @param defList 
   */
  public addDefList(defList: List) {
    this.defListCollection.add(defList);
  }

   /**
   * 
   * @param task 
   */
  public addTask(task: Task) {
    this.taskCollection.add(task);
  }

  /**
   * 
   * @param todayTask 
   */
  public addTodayTask(todayTask: TodayTask) {
    this.todayTaskCollection.add(todayTask);
  }

  /**
   * 
   * @param list 
   */
  public deleteList(list: List) {
    this.listDoc = this.afs.doc(`Lists/${list.listId}`);
    this.listDoc.delete();
    this.deleteRelatedTasks(list.listId);
  }

   /**
   * 
   * @param listId 
   */
  public deleteRelatedTasks(listId: string) {
    this.tasksDisplayService.filterTasksByListId(listId);
    this.tasksDisplayService.getObservableTasks().subscribe(tasks => {
      this.userTasks = tasks;
      this.userTasks.forEach(task => {
        console.log(task.taskName);
        this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
        this.taskDoc.delete();
      });
    });
  }

  /**
   * 
   */
  public deleteTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.delete();
  }

  /**
   * 
   * @param todayTask 
   */
  public deleteTodayTask(todayTask: Task) {
    this.todayTaskDoc = this.afs.doc(`TodayTasks/${todayTask.taskId}`);
    this.todayTaskDoc.delete();
  }
  
  /**
     * 
     * @param list 
     */
    public updateList(list: List) {
      this.listDoc = this.afs.doc(`Lists/${list.listId}`);
      console.log(this.listDoc);
      this.listDoc.update(list);
    }

    /**
     * 
     * @param task 
     */
    public updateTask(task: Task) {
      this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
      this.taskDoc.update(task);
    }

  /**
   * 
   * @param newArchive 
   */
  public moveToArchiveTasks(newArchive: Archive): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this.archiveCollection.add(newArchive).then((success) => {
        this.archiveDoc = this.afs.doc(`Archive/${newArchive.archiveId}`)
        resolve(success);
      }).catch((err) => {
        reject(err.message);
      });
    })
  }

  /**
   * 
   * @param task 
   */
  public checkTask(task: Task) {
    this.isCompleted = task.completed;
    console.log("completed " + this.isCompleted);
    this.isCompleted = !this.isCompleted;
    console.log("completed now " + this.isCompleted);
    let upadtedTask = { completed: this.isCompleted}
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.update(upadtedTask);
  }

  /**
   * 
   * @param todayTask 
   */
  public checkTodayTask(todayTask: TodayTask) {
    this.isCompleted = todayTask.completed;
    this.isCompleted = !this.isCompleted;
    let upadtedTodayTask = { completed: this.isCompleted }
    this.todayTaskDoc = this.afs.doc(`TodayTasks/${todayTask.taskId}`);
    this.todayTaskDoc.update(upadtedTodayTask);
  }

}
