
import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from './../../Models/Task';

@Component({
  selector: 'app-repeating-dialog',
  templateUrl: './repeating-dialog.component.html',
  styleUrls: ['./repeating-dialog.component.scss']
})
export class RepeatingDialogComponent implements OnInit {
  weekdays = [{ day: "Sunday", selected: true }, { day: "Monday", selected: false },
  { day: "Tuesday", selected: false }, { day: "Wednesday", selected: false },
  { day: "Thursday", selected: false }, { day: "Friday", selected: true }, { day: "Saturday", selected: false }];

  yearMonths = new Array("January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December");

  arr = new Array("eman", "Hanan");

  selected = 'Today';
  optionValue = "Weekly";
  constructor( @Inject(MAT_DIALOG_DATA) public data: Task) { }

  ngOnInit() {
  }

  select(weekday: any) {
    weekday.selected = !weekday.selected;
    console.log("is selected" + weekday.selected);
    if (weekday.selected) {
      this.arr.push(weekday.day);
    }
    else {
      for (var i = 0; i < this.arr.length; i++) {
        if(this.arr[i]==weekday.day){
          this.arr.splice(i,1);
        }

      }
    }
    console.log("array is" + this.arr)
  }

}
