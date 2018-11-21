import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingLogoComponent } from './starting-logo.component';

describe('StartingLogoComponent', () => {
  let component: StartingLogoComponent;
  let fixture: ComponentFixture<StartingLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
