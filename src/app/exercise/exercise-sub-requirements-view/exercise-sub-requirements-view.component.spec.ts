import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSubRequirementsViewComponent } from './exercise-sub-requirements-view.component';

describe('ExerciseSubRequirementsViewComponent', () => {
  let component: ExerciseSubRequirementsViewComponent;
  let fixture: ComponentFixture<ExerciseSubRequirementsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseSubRequirementsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseSubRequirementsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
