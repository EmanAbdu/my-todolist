import { Weekdays } from './../Models/Weekdays';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable } from 'rxjs';
import { List } from '../Models/List';
import { Task } from '../Models/Task';
import { TodayTask } from '../Models/TodayTask';
import { TasksDisplayService } from './tasks-display.service';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { formatDate } from '@angular/common';
import { snapshotChanges } from 'angularfire2/database';
import { Monthdays } from '../Models/Monthdays';

@Injectable({
  providedIn: 'root'
})

export class TasksOperationService {

  // ============================= Properties ============================= //



  // ----- Initialize def list and def lists array ----- //
  userDefLists: List[];
  userDefList: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  userTasks: Task[];
  userTask: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    UID: ''
  }
  userDefTasks: Task[];
  userDefTask: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    UID: ''
  }

  userTodayTasks: TodayTask[];
  userTodayTask: TodayTask = {
    taskId: '',
    taskName: '',
    dayDate: new Date,
    completed: false,
    defListRef: '',
    originalListRef: '',
    originalListName: '',
    UID: '',
  }


  lists$: Observable<List[]>;
  defList$: Observable<List[]>;
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


  isCompleted: boolean;
  public currentUID: string = localStorage.getItem("LoggedInUserID");


  // ============================= Functions ============================= //

  /**
   * 
   * @param afs 
   * @param tasksDisplayService 
   */
  constructor(public afs: AngularFirestore, public tasksDisplayService: TasksDisplayService) {

    // afs.firestore.settings({ timestampsInSnapshots: false });
    this.listCollection = this.afs.collection('Lists', ref => ref.orderBy('listName', 'asc'));
    this.defListCollection = this.afs.collection('Default Lists', ref => ref.orderBy('listName', 'asc'));
    this.taskCollection = this.afs.collection('Tasks', ref => ref.orderBy('taskName', 'asc'));
    this.todayTaskCollection = this.afs.collection('TodayTasks', ref => ref.orderBy('taskName', 'asc'));
    // -----------------------------------------------------

   


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
   */
  public deleteList(list: List) {
    this.listDoc = this.afs.doc(`Lists/${list.listId}`);
    this.listDoc.delete();

    this.deleteRelatedTasks(list.listId);
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
  public addTask(task: Task) {
    this.taskCollection.add(task);

  }
  public addTodayTask(todayTask: TodayTask) {
    this.todayTaskCollection.add(todayTask);

  }

  /**
   * 
   */
  public deleteTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.delete();
  }

  public deleteTodayTask(todayTask: Task) {
    this.todayTaskDoc = this.afs.doc(`TodayTasks/${todayTask.taskId}`);
    this.todayTaskDoc.delete();
  }

  /**
   * 
   * @param task 
   */
  updateTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.update(task);
  }

  /**
   * 
   * @param listId 
   */
  public deleteRelatedTasks(listId: string) {

    this.tasksDisplayService.filterTasksByListId(listId);
    console.log("  my list id:" + listId)

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
   * @param task 
   */
  checkTask(task: Task) {
    this.isCompleted = task.completed;
    console.log("completed " + this.isCompleted);
    this.isCompleted = !this.isCompleted;
    console.log("completed now " + this.isCompleted);
    let upadtedTask = { taskName: task.taskName, completed: this.isCompleted, listRef: task.listRef }
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.update(upadtedTask);
  }

  checkTodayTask(todayTask: TodayTask) {
    this.isCompleted = todayTask.completed;
    this.isCompleted = !this.isCompleted;
    let upadtedTodayTask = { completed: this.isCompleted }
    this.taskDoc = this.afs.doc(`TodayTasks/${todayTask.taskId}`);
    this.taskDoc.update(upadtedTodayTask);
  }

}
