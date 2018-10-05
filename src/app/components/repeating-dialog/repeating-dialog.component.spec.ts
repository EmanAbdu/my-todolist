import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatingDialogComponent } from './repeating-dialog.component';

describe('RepeatingDialogComponent', () => {
  let component: RepeatingDialogComponent;
  let fixture: ComponentFixture<RepeatingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
