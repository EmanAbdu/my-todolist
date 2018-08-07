import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpwdPageComponent } from './forgotpwd-page.component';

describe('ForgotpwdPageComponent', () => {
  let component: ForgotpwdPageComponent;
  let fixture: ComponentFixture<ForgotpwdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpwdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpwdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
