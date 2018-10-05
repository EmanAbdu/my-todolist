import { Weekdays } from './Weekdays';
export interface Task {
    taskId?: string;
    taskName?: string;
    completed?: boolean;
    listRef?: string;
    repeatingDays?: Weekdays[];
}