import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExecException } from 'child_process';
import { Subscription } from 'rxjs';
import { ExerciseService } from './exercise/exercise.service';
import { Exercise } from './models/exercise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'idelearn-exercise-editor';

  private exerciseSubscription!: Subscription;
  exercise!: Exercise | null;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions() {
    this.exerciseSubscription = this.exerciseService.currentExerciseObservable.subscribe((exercise: Exercise | null) => {
      this.exercise = exercise;
    });
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }
}
