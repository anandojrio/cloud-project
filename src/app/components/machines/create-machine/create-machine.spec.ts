import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMachine } from './create-machine';

describe('CreateMachine', () => {
  let component: CreateMachine;
  let fixture: ComponentFixture<CreateMachine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMachine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMachine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
