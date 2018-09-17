import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';;
import { Observable } from 'rxjs';
import { List } from '../Models/List';
import { Task } from '../Models/Task';
import { TasksDisplayService } from './tasks-display.service';

@Injectable({
  providedIn: 'root'
})

export class TasksOperationService {

  // ============================= Properties ============================= //


  tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
  }


  lists$: Observable<List[]>;
  defList: Observable<List[]>;
  tasks$: Observable<Task[]>;

  listCollection: AngularFirestoreCollection<List>;
  defListCollection: AngularFirestoreCollection<List>;
  taskCollection: AngularFirestoreCollection<Task>;

  listDoc: AngularFirestoreDocument<List>;
  defListDoc: AngularFirestoreDocument<List>;
  taskDoc: AngularFirestoreDocument<Task>;


  isCompleted: boolean;
 
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

  /**
   * 
   */
  public deleteTask(task: Task) {
    this.taskDoc = this.afs.doc(`Tasks/${task.taskId}`);
    this.taskDoc.delete();
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

    this.tasksDisplayService.filterByListId(listId);
    console.log("  my list id:" + listId)

    this.tasksDisplayService.getObservableTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.tasks.forEach(task => {
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

}
