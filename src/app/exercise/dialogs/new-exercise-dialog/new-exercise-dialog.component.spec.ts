import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExerciseDialogComponent } from './new-exercise-dialog.component';

describe('NewExerciseDialogComponent', () => {
  let component: NewExerciseDialogComponent;
  let fixture: ComponentFixture<NewExerciseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExerciseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExerciseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
