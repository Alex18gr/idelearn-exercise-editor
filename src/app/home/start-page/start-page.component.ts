import { Component, OnInit } from '@angular/core';
import { ExerciseDialogService } from 'src/app/exercise/dialogs/exercise-dialog.service';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { ExerciseFileService } from 'src/app/exercise/file/exercise-file.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  constructor(private exerciseFileService: ExerciseFileService,
    private exerciseService: ExerciseService,
    private exerciseDialogService: ExerciseDialogService) { }

  ngOnInit(): void {
  }

  openExerciseFile() {
    this.exerciseService.openExercise();
  }

  newExercise() {
    this.exerciseDialogService.showNewExerciseDialog();
  }

}
