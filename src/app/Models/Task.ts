import { Monthdays } from './Monthdays';
import { Weekdays } from './Weekdays';
// import { EventManager } from '@angular/platform-browser';
export interface Task {
    taskId?: string;
    taskName?: string;
    createdDate?:Date;
    completed?: boolean;
    listRef?: string;
    listName?: string;
    repeatingWeeklyDays?: Weekdays[];
    repeatingMonthlyDays?: Monthdays[];
    repeatingYearly?:string;
    isDaily?: boolean;
    moveInDay?;
    UID?:string;
}