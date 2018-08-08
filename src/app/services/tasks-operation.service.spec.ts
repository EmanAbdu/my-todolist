import { TestBed, inject } from '@angular/core/testing';

import { TasksOperationService } from './tasks-operation.service';

describe('TasksOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksOperationService]
    });
  });

  it('should be created', inject([TasksOperationService], (service: TasksOperationService) => {
    expect(service).toBeTruthy();
  }));
});
