import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercise-requirements-view',
  templateUrl: './exercise-requirements-view.component.html',
  styleUrls: ['./exercise-requirements-view.component.scss']
})
export class ExerciseRequirementsViewComponent implements OnInit {
  @Input() exercise!: Exercise;
  @Output() editClassRequirement: EventEmitter<ClassRequirement> = new EventEmitter();
  @Output() editClassRequirementSubrequirements: EventEmitter<ClassRequirement> = new EventEmitter();
  @Output() addClassRequirement: EventEmitter<void> = new EventEmitter();

  constructor(private confirmationService: ConfirmationService,
    private exerciseService: ExerciseService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  getClassRequirement(req: IRequirement): ClassRequirement {
    return req as ClassRequirement;
  }

  editRequirement(req: IRequirement) {
    if (req.type === 'class') {
      this.editClassRequirement.emit(req as ClassRequirement);
    }
  }

  editRequirementSubrequirements(req: IRequirement) {
    if (req.type === 'class') {
      this.editClassRequirementSubrequirements.emit(req as ClassRequirement);
    }
  }

  addRequirement() {
    this.addClassRequirement.emit();
  }

  onDrop(event: CdkDragDrop<IRequirement[]>) {
    moveItemInArray(this.exercise.requirements, event.previousIndex, event.currentIndex);
  }

  deleteRequirement(req: IRequirement) {
    this.confirmationService.confirm({
      header: 'Delete Class Requirement',
      message: 'Are you sure that you want to delete class requirement "' + (req as ClassRequirement).name + '"?',
      accept: () => {
        this.exerciseService.deleteClassRequirement((req as ClassRequirement)).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Delete Success', detail: 'Class Requirement "' + (req as ClassRequirement).name + '" deleted successfuly' });
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Delete error', detail: error });
        });
      }
    });
  }

}
