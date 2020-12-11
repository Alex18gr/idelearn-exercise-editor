import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseRequirementsViewComponent } from './exercise-requirements-view.component';

describe('ExerciseRequirementsViewComponent', () => {
  let component: ExerciseRequirementsViewComponent;
  let fixture: ComponentFixture<ExerciseRequirementsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseRequirementsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseRequirementsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
