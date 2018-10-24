import { Weekdays } from './Weekdays';
import { EventManager } from '@angular/platform-browser';
export interface Task {
    taskId?: string;
    taskName?: string;
    createdDate?:Date;
    completed?: boolean;
    listRef?: string;
    listName?: string;
    repeatingDays?: Weekdays[];
    moveInDay?;
    UID?:string;
}