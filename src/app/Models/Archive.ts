import { TodayTask } from "./TodayTask";

export interface Archive{
    archiveId?:string;
    archiveDate?;
    archiveTasks?: TodayTask[];
    tasksNum?: number;
    checkedTasksNum?:number;
    percentage?: number;
    UID?: string;
    
}