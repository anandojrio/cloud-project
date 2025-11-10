import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAction } from './schedule-action';

describe('ScheduleAction', () => {
  let component: ScheduleAction;
  let fixture: ComponentFixture<ScheduleAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
