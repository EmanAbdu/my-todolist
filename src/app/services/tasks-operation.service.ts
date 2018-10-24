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

@Injectable({
  providedIn: 'root'
})

export class TasksOperationService {

  // ============================= Properties ============================= //



  // ----- Initialize def list and def lists array ----- //
  defLists: List[];
  defList: List = {
    listId: '',
    listName: '',
    UID: '',
  }

  tasks: Task[];
  task: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    UID: ''
  }
  defTasks: Task[];
  defTask: Task = {
    taskId: '',
    taskName: '',
    listRef: '',
    completed: false,
    UID: ''
  }

  todayTasks: TodayTask[];
  todayTask: TodayTask = {
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

    this.tasksDisplayService.filterListsByUID(this.currentUID);
    this.tasksDisplayService.getObservableDefLists().subscribe(defLists => {
      this.defLists = defLists;
      this.defList = this.defLists[0];
      // console.log("The dfault list is " + this.defList.listName + "and the Id is " + this.defList.listId);

      let date = new Date();
      let today = date.getDay();

      this.tasksDisplayService.filterTodayTasksByUID(this.currentUID);
      this.tasksDisplayService.getObservableTodayTasks().subscribe(todayTasks => {
        this.todayTasks = todayTasks;

      });

      this.tasksDisplayService.filterTasksByUID(this.currentUID);
      this.tasksDisplayService.getObservableTasks().subscribe(tasks => {
        this.tasks = tasks;
        // let fromdate = fromDate(new Date);
        // console.log();
        //     console.log("H I'm tasks operations ")
        for (let i = 0; i < tasks.length; i++) {
          // let timestamp: Timestamp = Timestamp.bind(tasks[i].moveInDay);
          // const timestamp = snapshot.get('created_at');
          // const date = timestamp.toDate();


          let myday = tasks[i].moveInDay.toDate();
          //  let myday= new Timestamp(tasks[i].moveInDay, 1);
          console.log("TodayTask name " + tasks[i].taskName);
          console.log("TodayTask date " + myday);
          let shouldCopied: boolean = true;
          let movedTask = null;

          let taskRepeatingWeeklyDays: Weekdays[] = tasks[i].repeatingWeeklyDays;
          for (let j = 0; j < taskRepeatingWeeklyDays.length; j++) {
            if (taskRepeatingWeeklyDays[j].selected && taskRepeatingWeeklyDays[j].dayId == today) {
              // console.log("TodayTask name " + tasks[i].taskName);

              movedTask = tasks[i];
              console.log("movedTask name " + movedTask.taskName);

            }
          }

          for (let x = 0; x < this.todayTasks.length; x++) {
            if (this.todayTasks[x].taskName == this.tasks[i].taskName) {
              // console.log(this.todayTasks[x].taskName+" && "+ tasks[i].taskName);
              shouldCopied = false;
              break;
            }
            // console.log("Todays Tasks" + this.todayTasks[x].taskName)
          }
          if ((shouldCopied && movedTask != null)
            || (shouldCopied &&
              myday.getDate() == date.getDate()
              && myday.getMonth() == date.getMonth()
              && myday.getFullYear() == date.getFullYear())) {
            let month = new Date(tasks[i].moveInDay);

            console.log(shouldCopied + " && " + tasks[i].taskName + " && " + date.getDate() + " && " + month.getMonth());
            let myTask = {
              taskName: tasks[i].taskName, dayDate: new Date, completed: false, originalListRef: tasks[i].listRef, defListRef: this.defList.listId, originalListName: tasks[i].listName, UID: this.currentUID

            }
            this.addTodayTask(myTask);
            // console.log("copied task is " + this.tasks[i].taskName)
          }



          // console.log(myTask);
          // this.addTask(myTask);
          //       let taskRepeatingDays: Weekdays[] = tasks[i].repeatingDays
          //       for (let j = 0; j < taskRepeatingDays.length; j++) {
          //         if (taskRepeatingDays[j].selected && taskRepeatingDays[j].dayId == today) {
          //           // console.log("we select this day for today's tasks: " + tasks[i].taskName);
          //           console.log("this.defList.listId " + this.defList.listId);
          //           this.task = {
          //             taskName: "Hi geekkkksksk", completed: tasks[i].completed, listRef: this.defList.listId, UID: this.currentUID, repeatingDays: [
          //               { dayId: 0, dayName: "Sunday", selected: false }, { dayId: 1, dayName: "Monday", selected: false },
          //               { dayId: 2, dayName: "Tuesday", selected: false }, { dayId: 3, dayName: "Wednesday", selected: false },
          //               { dayId: 4, dayName: "Thursday", selected: false }, { dayId: 5, dayName: "Friday", selected: false },
          //               { dayId: 6, dayName: "Saturday", selected: false },
          //             ]
          //           }


          //           // this.taskCollection.add(movedTask);
          //           // this.deleteTask(tasks[i]);

          //         }
          //       }
        }
        //     console.log("we select this day for today's tasks: " + this.task.taskName);

        //     // this.addTask(this.task);
      });

    });




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

  checkTodayTask(todayTask: TodayTask) {
    this.isCompleted = todayTask.completed;
    this.isCompleted = !this.isCompleted;
    let upadtedTodayTask = { completed: this.isCompleted }
    this.taskDoc = this.afs.doc(`TodayTasks/${todayTask.taskId}`);
    this.taskDoc.update(upadtedTodayTask);
  }

}
