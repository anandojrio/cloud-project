import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHistory } from './error-history';

describe('ErrorHistory', () => {
  let component: ErrorHistory;
  let fixture: ComponentFixture<ErrorHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
