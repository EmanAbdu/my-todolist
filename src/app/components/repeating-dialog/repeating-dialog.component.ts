import { Monthdays } from './../../Models/Monthdays';
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
  day = this.today.getDay();
  weekdays: Weekdays[];
  monthdays: Monthdays[];

  // yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
  //   "August", "September", "October", "November", "December");

  selected = 'Today';
  optionValue = "Weekly";
  constructor(public thisDialogRef: MatDialogRef<RepeatingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Task, public tasksOperationsService: TasksOperationService) {
    this.weekdays = this.data.repeatingWeeklyDays;
    this.monthdays = this.data.repeatingMonthlyDays;
  }

  ngOnInit() {

    // this.weekdays = this.data.repeatingDays;
  }

  select(repeatingDay: any) {
    if(this.selected== 'Weekly'){
      let weekday = repeatingDay;
    weekday.selected = !weekday.selected;
    }
    if(this.selected =='Monthly'){
      let monthday= repeatingDay;
      monthday.selected = ! monthday.selected;
    }
  }


  //------ onCloseConfirm Function -------//
  onCloseConfirm() {
    this.thisDialogRef.close('Confirm');

    if(this.selected=='Weekly'){
    this.data.repeatingWeeklyDays = this.weekdays;
    }

    if (this.selected == 'Today') {
      this.data.moveInDay = new Date();
    }

    if (this.selected == 'Tommorrow') {

      let today = new Date();
      let nextDay = new Date(today.setDate(today.getDate() + 1));
      this.data.moveInDay = nextDay;
    }

    if(this.selected=='Monthly'){
      // this.data.repeatingMonthlyDays
    }
    this.tasksOperationsService.updateTask(this.data);

  }

  //------ onCloseCancel Function -------//
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
    console.log("This is cancelled");
    // this.todoService.getTodos();

  }

}
