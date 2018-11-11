import { Component, OnInit, Inject } from '@angular/core';
import { Monthdays } from './../../Models/Monthdays';
import { TasksOperationService } from './../../services/tasks-operation.service';
import { Weekdays } from './../../Models/Weekdays';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from './../../Models/Task';

@Component({
  selector: 'app-repeating-dialog',
  templateUrl: './repeating-dialog.component.html',
  styleUrls: ['./repeating-dialog.component.scss']
})
export class RepeatingDialogComponent implements OnInit {

  today = new Date();
  dd = this.today.getDate();
  mm = this.today.getMonth();  //January is 0!
  yyyy = this.today.getFullYear();
  day = this.today.getDay();

  weekdays: Weekdays[] = [
    { dayId: 0, dayName: "Sunday", selected: false }, { dayId: 1, dayName: "Monday", selected: false },
    { dayId: 2, dayName: "Tuesday", selected: false }, { dayId: 3, dayName: "Wednesday", selected: false },
    { dayId: 4, dayName: "Thursday", selected: false }, { dayId: 5, dayName: "Friday", selected: false },
    { dayId: 6, dayName: "Saturday", selected: false },
  ];

  monthdays: Monthdays[] = [
    { dayId: 1, selected: false }, { dayId: 2, selected: false }, { dayId: 3, selected: false },
    { dayId: 4, selected: false }, { dayId: 5, selected: false }, { dayId: 6, selected: false }, { dayId: 7, selected: false },
    { dayId: 8, selected: false }, { dayId: 9, selected: false }, { dayId: 10, selected: false }, { dayId: 11, selected: false },
    { dayId: 12, selected: false }, { dayId: 13, selected: false }, { dayId: 14, selected: false }, { dayId: 15, selected: false },
    { dayId: 16, selected: false }, { dayId: 17, selected: false }, { dayId: 18, selected: false }, { dayId: 19, selected: false },
    { dayId: 20, selected: false }, { dayId: 21, selected: false }, { dayId: 22, selected: false }, { dayId: 23, selected: false },
    { dayId: 24, selected: false }, { dayId: 25, selected: false }, { dayId: 26, selected: false }, { dayId: 27, selected: false },
    { dayId: 28, selected: false }, { dayId: 29, selected: false }, { dayId: 30, selected: false }, { dayId: 31, selected: false }
  ]

  repeatedWeekdays: Weekdays[] = [];
  repeatedMonthdays: Monthdays[] = [];

  yearMonths: any[] = [
    { monthId: 1, monthName: "January" }, { monthId: 2, monthName: "February" }, { monthId: 3, monthName: "March" },
    { monthId: 4, monthName: "April" }, { monthId: 5, monthName: "May" }, { monthId: 6, monthName: "June" }, { monthId: 7, monthName: "July" },
    { monthId: 8, monthName: "August" }, { monthId: 9, monthName: "September" }, { monthId: 10, monthName: "October" },
    { monthId: 11, monthName: "November" }, { monthId: 12, monthName: "December" }
  ];

  yearMonthDays: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  repeatingYearly: string;
  repeatingYearlyArray: string[];

  selectedYearDay: number;
  selectedYearMonth: number;

  isDaily: boolean;

  moveInDay: any;
  isyearMonth: boolean = true;


  // yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
  //   "August", "September", "October", "November", "December");

  selected = this.data.selectedRepeatingOption;
  optionValue = "Weekly";
  constructor(public thisDialogRef: MatDialogRef<RepeatingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Task, public tasksOperationsService: TasksOperationService) {

  }

  ngOnInit() {

    this.weekdays.forEach(weekday => {
      this.data.repeatingWeeklyDays.forEach(repeatingWeeklydays => {
        if (weekday.dayId == repeatingWeeklydays.dayId) {
          weekday.selected = true;
        }
      })
    })

    this.monthdays.forEach(monthday => {
      this.data.repeatingMonthlyDays.forEach(repeatingMonthlydays => {
        if (monthday.dayId == repeatingMonthlydays.dayId) {
          monthday.selected = true;
        }
      })
    })

    if (this.data.moveInDay != null) {
      this.moveInDay = this.data.moveInDay.toDate();
    }

    this.isDaily == this.data.isDaily;

    this.selectedYearDay = this.data.yearlyDay;
    this.selectedYearMonth = this.data.yearlyMonth

  }

  /**
   * 
   */
  checkDaily() {
    this.isDaily = !this.isDaily;

  }

  /**
   * 
   * @param repeatingDay 
   */
  select(repeatingDay: any) {
    if (this.selected == 'Weekly') {
      let weekday = repeatingDay;
      weekday.selected = !weekday.selected;

    }

    if (this.selected == 'Weekly1') {

      let weekday1 = repeatingDay;
      weekday1.selected = !weekday1.selected;
    }

    if (this.selected == 'Monthly') {
      let monthday = repeatingDay;
      monthday.selected = !monthday.selected;
    }
  }

  /**
   * 
   * @param yearMonth 
   */
  setSelectedMonth(yearMonth: any) {
    this.selectedYearMonth = yearMonth.monthId;
    this.selectedYearMonth = yearMonth.monthId;
    this.isyearMonth = false;

  }

  /**
   * 
   * @param yearDay 
   */
  setSelectedYearDay(yearDay: number) {
    this.selectedYearDay = yearDay;
    this.selectedYearDay = yearDay;
  }


  goToYearMonths() {
    this.isyearMonth = true;
  }
  //------ onCloseConfirm Function -------//
  /**
   * 
   */
  onCloseConfirm() {
    this.thisDialogRef.close('Confirm');

    if (this.selected == '--') {

      // for (let i = 0; i < this.weekdays.length; i++) {
      //   this.weekdays[i].selected = false;

      // }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.moveInDay = null;
      this.isDaily = false;
      this.repeatingYearly = '0-0';


    }
    if (this.selected == 'Today') {

      this.moveInDay = new Date();

      this.isDaily = false;
      this.repeatedWeekdays = [];
      this.repeatedMonthdays = [];
      this.repeatingYearly = '0-0';


    }

    else if (this.selected == 'Tommorrow') {

      let today = new Date();
      let nextDay = new Date(today.setDate(today.getDate() + 1));
      this.moveInDay = nextDay;

      this.isDaily = false;
      this.repeatedWeekdays = [];
      this.repeatedMonthdays = [];
      this.repeatingYearly = '0-0';
    }

    else if (this.selected == 'Daily' && this.isDaily == true) {
      this.isDaily = true;

      this.moveInDay = null;
      this.repeatedWeekdays = [];
      this.repeatedMonthdays = [];
      this.repeatingYearly = '0-0'

    }


    else if (this.selected == 'Weekly') {

      this.weekdays.forEach(weekday => {
        if (weekday.selected == true) {
          this.repeatedWeekdays.push(weekday);
        }
      });

      this.moveInDay = null;
      this.isDaily = false;
      this.repeatedMonthdays = [];
      this.repeatingYearly = '0-0';

    }


    else if (this.selected == 'Monthly') {

      this.monthdays.forEach(monthday => {
        if (monthday.selected == true) {
          this.repeatedMonthdays.push(monthday);
        }
      });

      this.repeatedWeekdays = [];
      this.moveInDay = null;
      this.isDaily = false;
      this.repeatingYearly = '0-0';
    }

    else if (this.selected == 'Yearly') {



      this.moveInDay = null;
      this.isDaily = false;
      this.repeatedWeekdays = [];
      this.repeatedMonthdays = [];
    }


    else if (this.selected == 'Pick A Date') {

      this.isDaily = false;
      this.repeatedWeekdays = [];
      this.repeatedMonthdays = [];
      this.repeatingYearly = '0-0';
    }


    this.data.moveInDay = this.moveInDay;
    this.data.isDaily = this.isDaily;
    this.data.repeatingWeeklyDays = this.repeatedWeekdays;
    this.data.repeatingMonthlyDays = this.repeatedMonthdays;
    this.data.yearlyDay = this.selectedYearDay;
    this.data.yearlyMonth = this.selectedYearMonth;

    this.data.selectedRepeatingOption = this.selected;

    this.tasksOperationsService.updateTask(this.data);

  }

  //------ onCloseCancel Function -------//
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
    console.log("This is cancelled");
    // this.todoService.getTodos();

  }

}
