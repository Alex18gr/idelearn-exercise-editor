import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEditDetailsDialogComponent } from './exercise-edit-details-dialog.component';

describe('ExerciseEditDetailsDialogComponent', () => {
  let component: ExerciseEditDetailsDialogComponent;
  let fixture: ComponentFixture<ExerciseEditDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseEditDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseEditDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
