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

  yearMonthDays: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  repeatingYearly: string;
  repeatingYearlyArray: string[];

  selectedYearMonth: number;
  selectedYearDay: number;

  isDaily: boolean;

  moveInDay: any;


  // yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
  //   "August", "September", "October", "November", "December");

  selected = this.data.selectedRepeatingOption;
  optionValue = "Weekly";
  constructor(public thisDialogRef: MatDialogRef<RepeatingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Task, public tasksOperationsService: TasksOperationService) {

  }

  ngOnInit() {

    if (this.data.moveInDay != null) {
      this.moveInDay = this.data.moveInDay.toDate();
    }

    this.isDaily == this.data.isDaily;

    this.weekdays = this.data.repeatingWeeklyDays;

    this.monthdays = this.data.repeatingMonthlyDays;

    this.repeatingYearly = this.data.repeatingYearly
    this.repeatingYearlyArray = this.repeatingYearly.split("-");

    this.selectedYearMonth = parseInt(this.repeatingYearlyArray[1], 10);
    this.selectedYearDay = parseInt(this.repeatingYearlyArray[0], 10);

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

  }

  /**
   * 
   * @param yearDay 
   */
  setSelectedYearDay(yearDay: number) {
    this.selectedYearDay = yearDay;
  }

  //------ onCloseConfirm Function -------//
  /**
   * 
   */
  onCloseConfirm() {
    this.thisDialogRef.close('Confirm');

    if(this.selected =='--'){

      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;

      }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.moveInDay = null;
      this.isDaily = false;
      this.repeatingYearly = '0-0';


    }
    if (this.selected == 'Today') {
      
      this.moveInDay = new Date();

      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;

      }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }


      this.isDaily = false;
      this.repeatingYearly = '0-0';


    }

    else if (this.selected == 'Tommorrow') {

      let today = new Date();
      let nextDay = new Date(today.setDate(today.getDate() + 1));
      this.moveInDay = nextDay;

      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;

      }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.isDaily = false;
      this.repeatingYearly = '0-0';
    }

    else if (this.selected == 'Daily' && this.isDaily == true) {
      this.isDaily = true;

      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;

      }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.moveInDay = null;
      this.repeatingYearly = '0-0'


    }


    else if (this.selected == 'Weekly') {

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.moveInDay = null;
      this.isDaily = false;
      this.repeatingYearly = '0-0';

    }

    else if (this.selected == 'Monthly') {

      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;

      }

      this.moveInDay = null;
      this.isDaily = false;
      this.repeatingYearly = '0-0';
    }

    else if (this.selected == 'Yearly') {
      // this.data.repeatingMonthlyDays
      this.repeatingYearly = this.selectedYearDay + "-" + this.selectedYearMonth;


      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;
      }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.isDaily = false;
      this.moveInDay = null;
    }


    else if (this.selected == 'Pick A Date') {
      for (let i = 0; i < this.weekdays.length; i++) {
        this.weekdays[i].selected = false;
      }

      for (let i = 0; i < this.monthdays.length; i++) {
        this.monthdays[i].selected = false;
      }

      this.isDaily = false;
      this.repeatingYearly = '0-0';
    }


    this.data.moveInDay =this.moveInDay;
    this.data.isDaily=this.isDaily;
    this.data.repeatingWeeklyDays =this.weekdays;
    this.data.repeatingMonthlyDays= this.monthdays;
    this.data.repeatingYearly =this.repeatingYearly;

    this.data.selectedRepeatingOption=this.selected;

    this.tasksOperationsService.updateTask(this.data);

  }

  //------ onCloseCancel Function -------//
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
    console.log("This is cancelled");
    // this.todoService.getTodos();

  }

}
