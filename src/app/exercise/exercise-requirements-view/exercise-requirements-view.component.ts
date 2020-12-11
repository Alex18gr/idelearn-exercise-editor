import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';

@Component({
  selector: 'app-exercise-requirements-view',
  templateUrl: './exercise-requirements-view.component.html',
  styleUrls: ['./exercise-requirements-view.component.scss']
})
export class ExerciseRequirementsViewComponent implements OnInit {
  @Input() exercise!: Exercise;
  @Output() editClassRequirement: EventEmitter<ClassRequirement> = new EventEmitter();
  @Output() addClassRequirement: EventEmitter<void> = new EventEmitter();

  constructor() { }

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

  addRequirement() {
    this.addClassRequirement.emit();
  }

}
