import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IRequirement } from 'src/app/models/requirements/irequirement';

@Injectable({
  providedIn: 'root'
})
export class ExerciseDialogService {

  private showEditRequirementDialogSubject: Subject<{ requirement?: IRequirement }> = new Subject();
  public showEditRequirementDialogObservable: Observable<{ requirement?: IRequirement }> = this.showEditRequirementDialogSubject.asObservable();

  private showEditSubrequirementDialogSubject: Subject<{ parentRequirement: IRequirement, subrequirement?: IRequirement }> = new Subject();
  public showEditSubRequirementDialogObservable: Observable<{ parentRequirement: IRequirement, subrequirement?: IRequirement }> = this.showEditSubrequirementDialogSubject.asObservable();

  constructor() { }

  showEditRequirementDialog(options?: { requirement?: IRequirement }) {
    this.showEditRequirementDialogSubject.next(options);
  }

  showEditSubrequirementDialog(options?: { parentRequirement: IRequirement, subrequirement?: IRequirement }) {
    this.showEditSubrequirementDialogSubject.next(options);
  }

}
