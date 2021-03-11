import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Exercise } from 'src/app/models/exercise';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { RequirementMethod } from 'src/app/models/requirements/requirement-method';

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

  private showNewExerciseSubject: Subject<void> = new Subject();
  public showNewExerciseObservable: Observable<void> = this.showNewExerciseSubject.asObservable();

  private showExerciseSaveChangesDialogSubject: Subject<{ promptType: 'new' | 'open' | 'close' }> = new Subject();
  public showExerciseSaveChangesDialogObservable: Observable<{ promptType: 'new' | 'open' | 'close' }> = this.showExerciseSaveChangesDialogSubject.asObservable();

  private showPickMethodDialogSubject: Subject<{ control: string }> = new Subject();
  public showPickMethodDialogObservable: Observable<{ control: string }> = this.showPickMethodDialogSubject.asObservable();

  private methodSelectedSubject: Subject<{ method: RequirementMethod, control: string }> = new Subject();
  public methodSelectedObservable: Observable<{ method: RequirementMethod, control: string }> = this.methodSelectedSubject.asObservable();

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

  showNewExerciseDialog() {
    this.showNewExerciseSubject.next();
  }

  showExerciseSaveChangesDialog(options: { promptType: 'new' | 'open' | 'close' }) {
    this.showExerciseSaveChangesDialogSubject.next(options);
  }

  showPickMethodDialog(options: { control: string }) {
    this.showPickMethodDialogSubject.next(options);
  }

  methodSelected(method: { method: RequirementMethod, control: string }) {
    this.methodSelectedSubject.next(method);
  }

}
