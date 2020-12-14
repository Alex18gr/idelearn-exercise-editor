import { Component, OnInit } from '@angular/core';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { ExerciseFileService } from 'src/app/exercise/file/exercise-file.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  constructor(private exerciseFileService: ExerciseFileService,
    private exerciseService: ExerciseService) { }

  ngOnInit(): void {
  }

  openExerciseFile() {
    this.exerciseFileService.openExerciseFileWithDialog().subscribe(data => {
      console.log(data);
      if (data) {
        this.exerciseService.openExerciseByJsonObject(data);
      }
    });
  }

}
