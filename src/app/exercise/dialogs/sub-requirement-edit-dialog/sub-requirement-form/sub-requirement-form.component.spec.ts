import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRequirementFormComponent } from './sub-requirement-form.component';

describe('SubRequirementFormComponent', () => {
  let component: SubRequirementFormComponent;
  let fixture: ComponentFixture<SubRequirementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubRequirementFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRequirementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
