import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { IRequirement } from 'src/app/models/requirements/irequirement';

@Injectable({
  providedIn: 'root'
})
export class ExerciseDialogService {

  private showEditRequirementDialogSubject: Subject<{ requirement?: IRequirement }> = new Subject();
  public showEditRequirementDialogObservable: Observable<{ requirement?: IRequirement }> = this.showEditRequirementDialogSubject.asObservable();

  private showEditSubrequirementDialogSubject: Subject<{ parentRequirement: IRequirement, subrequirement?: IRequirement }> = new Subject();
  public showEditSubRequirementDialogObservable: Observable<{ parentRequirement: IRequirement, subrequirement?: IRequirement }> = this.showEditSubrequirementDialogSubject.asObservable();

  private showEditExerciseDetailsSubject: Subject<Exercise> = new Subject();
  public showEditExerciseDetailsObservable: Observable<Exercise> = this.showEditExerciseDetailsSubject.asObservable();

  constructor() { }

  showEditRequirementDialog(options?: { requirement?: IRequirement }) {
    this.showEditRequirementDialogSubject.next(options);
  }

  showEditSubrequirementDialog(options?: { parentRequirement: IRequirement, subrequirement?: IRequirement }) {
    this.showEditSubrequirementDialogSubject.next(options);
  }

  showEditExerciseDetailsDialog(exercise: Exercise) {
    this.showEditExerciseDetailsSubject.next(exercise);
  }

}
