export interface TodayTask {
    taskId?: string;
    taskName?: string;
    dayDate?:Date;
    completed?: boolean;
    defListRef?:string;
    originalListRef?:string;
    originalListName?:string;
    UID?:string;
}