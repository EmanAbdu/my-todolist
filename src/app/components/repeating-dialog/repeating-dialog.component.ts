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
  yearMonths: any[] = [
    { monthId: 1, monthName: "January" }, { monthId: 2, monthName: "February" }, { monthId: 3, monthName: "March" },
    { monthId: 4, monthName: "April" }, { monthId: 5, monthName: "May" }, { monthId: 6, monthName: "June" }, { monthId: 7, monthName: "July" },
    { monthId: 8, monthName: "August" }, { monthId: 9, monthName: "September" }, { monthId: 10, monthName: "October" },
    { monthId: 11, monthName: "November" }, { monthId: 12, monthName: "December" }
  ];
  yearlyRepeating = this.data.repeatingYearly.split("-");

  selectedYearMonth: number = parseInt(this.yearlyRepeating[1], 10);
  selectedYearDay: number = parseInt(this.yearlyRepeating[0], 10);
  isDaily: boolean = this.data.isDaily;
  moveInDay = this.data.moveInDay.toDate();
  yearMonthDays: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  // yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
  //   "August", "September", "October", "November", "December");

  selected = 'Today';
  optionValue = "Weekly";
  constructor(public thisDialogRef: MatDialogRef<RepeatingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Task, public tasksOperationsService: TasksOperationService) {
    this.weekdays = this.data.repeatingWeeklyDays;
    this.monthdays = this.data.repeatingMonthlyDays;
  }

  ngOnInit() {

    console.log(this.yearlyRepeating);
    console.log("selectedYearMonth " + this.selectedYearMonth);
    console.log("selectedYearDay " + this.selectedYearDay);
    console.log("moveInDay " + this.moveInDay);



  }

  checkDaily() {
    this.isDaily = !this.isDaily;

  }
  select(repeatingDay: any) {
    if (this.selected == 'Weekly') {
      let weekday = repeatingDay;
      weekday.selected = !weekday.selected;
    }
    if (this.selected == 'Monthly') {
      let monthday = repeatingDay;
      monthday.selected = !monthday.selected;
    }
  }

  setSelectedMonth(yearMonth: any) {
    this.selectedYearMonth = yearMonth.monthId;

  }

  setSelectedYearDay(yearDay: number) {
    this.selectedYearDay = yearDay;
  }
  //------ onCloseConfirm Function -------//
  onCloseConfirm() {
    this.thisDialogRef.close('Confirm');

    this.data.isDaily = this.isDaily;

    if (this.selected == 'Weekly') {
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

    if (this.selected == 'Monthly') {
      // this.data.repeatingMonthlyDays
    }

    if (this.selected == 'Yearly') {
      // this.data.repeatingMonthlyDays
      let yearlyRepeating = this.selectedYearDay + "-" + this.selectedYearMonth;
      this.data.repeatingYearly = yearlyRepeating;
    }


    if (this.selected == 'Pick A Date') {
      this.data.moveInDay = this.moveInDay;
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
