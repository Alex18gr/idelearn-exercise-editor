import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ExerciseDialogService } from '../dialogs/exercise-dialog.service';
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
  savingData: boolean = false;

  constructor(private exerciseService: ExerciseService,
    private messageService: MessageService,
    private exerciseDialogService: ExerciseDialogService) { }

  ngOnInit(): void {
    this.initializeExerciseSubscriptions();
  }

  initializeExerciseSubscriptions() {
    this.exerciseSubscription = this.exerciseService.currentExerciseObservable.subscribe((exercise: Exercise | null) => {
      if (exercise) { this.exercise = exercise }
    });
  }

  generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  addNewRequirement() {
    this.exerciseDialogService.showEditRequirementDialog();
  }

  editClassRequirement(req: ClassRequirement) {
    this.exerciseDialogService.showEditRequirementDialog({ requirement: req });
  }

  editClassRequirementSubrequirements(req: ClassRequirement) {
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

  editExerciseDetails() {
    this.exerciseDialogService.showEditExerciseDetailsDialog(this.exercise);
  }

  exportExercise() {
    this.savingData = true;
    this.exerciseService.exportExercise().subscribe(res => {
      this.savingData = false;
      this.messageService.add({ severity: 'success', summary: 'Edit Success', detail: 'Exercise exported successfuly' });
    }, error => {
      this.savingData = false;
      this.messageService.add({ severity: 'error', summary: 'Export Error', detail: error });
    });
  }
}
