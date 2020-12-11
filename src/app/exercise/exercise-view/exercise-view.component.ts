import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercise-view',
  templateUrl: './exercise-view.component.html',
  styleUrls: ['./exercise-view.component.scss']
})
export class ExerciseViewComponent implements OnInit, OnDestroy {

  exercise!: Exercise;

  editRequirement!: ClassRequirement;
  editSubRequirement: boolean = false;
  exerciseSubscription!: Subscription;

  constructor(private exerciseService: ExerciseService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.initializeExerciseSubscriptions();
    this.exerciseService.openExercise().subscribe(data => {
      this.exercise = data;
    });
  }

  initializeExerciseSubscriptions() {
    this.exerciseService.openExercise().subscribe(data => {
      // data loaded
      this.messageService.add({severity:'success', summary:'Exercise Loaded' });
    }, error => {
      this.messageService.add({severity:'error', summary:'Exercise Load Error' });
    });
    this.exerciseSubscription = this.exerciseService.currentExerciseObservable.subscribe((exercise: Exercise | null) => {
      if (exercise) { this.exercise = exercise }
    });
  }

  generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  editClassRequirement(req: ClassRequirement) {
    this.editRequirement = req;
    this.editSubRequirement = true;
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }

  backToRequirements() {
    this.editSubRequirement = false;
  }
}
