import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IRequirement } from 'src/app/models/requirements/irequirement';

@Injectable({
  providedIn: 'root'
})
export class ExerciseDialogService {

  private showEditRequirementDialogSubject: Subject<{requirement?: IRequirement}> = new Subject();
  public showEditRequirementDialogObservable: Observable<{requirement?: IRequirement}> = this.showEditRequirementDialogSubject.asObservable();

  private showEditSubrequirementDialogSubject: Subject<{subrequirement?: IRequirement}> = new Subject();
  public showEditSubrequirementDialogObservable: Observable<{subrequirement?: IRequirement}> = this.showEditSubrequirementDialogSubject.asObservable();

  constructor() { }

  showEditRequirementDialog(options?: {requirement?: IRequirement}) {
    this.showEditRequirementDialogSubject.next(options);
  }

  showEditSubrequirementDialog(options?: {subrequirement?: IRequirement}) {
    this.showEditSubrequirementDialogSubject.next(options);
  }

}
