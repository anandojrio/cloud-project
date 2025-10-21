import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSearch } from './machine-search';

describe('MachineSearch', () => {
  let component: MachineSearch;
  let fixture: ComponentFixture<MachineSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
