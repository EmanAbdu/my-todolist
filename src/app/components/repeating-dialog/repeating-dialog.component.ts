import { TasksOperationService } from './../../services/tasks-operation.service';
import { Weekdays } from './../../Models/Weekdays';

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from './../../Models/Task';

@Component({
  selector: 'app-repeating-dialog',
  templateUrl: './repeating-dialog.component.html',
  styleUrls: ['./repeating-dialog.component.scss']
})
export class RepeatingDialogComponent implements OnInit {
  // weekdays = [{ day: "Sunday", selected: true }, { day: "Monday", selected: false },
  // { day: "Tuesday", selected: false }, { day: "Wednesday", selected: false },
  // { day: "Thursday", selected: false }, { day: "Friday", selected: true }, { day: "Saturday", selected: false }];

  today = new Date();
  dd = this.today.getDate();
  mm = this.today.getMonth();  //January is 0!
  yyyy = this.today.getFullYear();
  day= this.today.getDay();
  weekdays: any[];

  yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December");

  arr = new Array("eman", "Hanan");

  selected = 'Today';
  optionValue = "Weekly";
  constructor(public thisDialogRef: MatDialogRef<RepeatingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Task, public tasksOperationsService: TasksOperationService) { }

  ngOnInit() {
    this.weekdays = this.data.repeatingDays;
  }

  select(weekday: any) {
    weekday.selected = !weekday.selected;
    console.log("is selected" + weekday.selected);
    if (weekday.selected) {
      this.arr.push(weekday.day);
    }
    else {
      for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i] == weekday.day) {
          this.arr.splice(i, 1);
        }

      }
    }
    console.log("array is" + this.arr)
  }


  //------ onCloseConfirm Function -------//
  onCloseConfirm() {
    this.thisDialogRef.close('Confirm');
    this.data.repeatingDays = this.weekdays;
    // this.todoService.updateItem(this.data.id, this.data.name);

    this.tasksOperationsService.updateTask(this.data);
    for(var i = 0; i < this.weekdays.length; i++){
      if(this.weekdays[i].dayId== this.day && this.weekdays[i].selected ==true){
        console.log("day"+i+" dayName:"+this.weekdays[i].dayName);
      }

    }
  }

  //------ onCloseCancel Function -------//
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
    console.log("This is cancelled");
    // this.todoService.getTodos();

  }

}
