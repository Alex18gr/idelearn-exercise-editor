import { Component, OnInit } from '@angular/core';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercise-view',
  templateUrl: './exercise-view.component.html',
  styleUrls: ['./exercise-view.component.scss']
})
export class ExerciseViewComponent implements OnInit {

  exercise!: Exercise;

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.exerciseService.openExercise().subscribe(data => {
      this.exercise = data;
    });
  }

  generateUniqueId() {
   return Math.random().toString(36).substr(2, 9);
  }

}
