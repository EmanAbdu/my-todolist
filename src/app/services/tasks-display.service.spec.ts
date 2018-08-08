import { TestBed, inject } from '@angular/core/testing';

import { TasksDisplayService } from './tasks-display.service';

describe('TasksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksDisplayService]
    });
  });

  it('should be created', inject([TasksDisplayService], (service: TasksDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
