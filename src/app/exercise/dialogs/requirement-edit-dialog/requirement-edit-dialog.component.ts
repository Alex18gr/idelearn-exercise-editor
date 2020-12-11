import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { ExerciseDialogService } from '../exercise-dialog.service';

@Component({
  selector: 'app-requirement-edit-dialog',
  templateUrl: './requirement-edit-dialog.component.html',
  styleUrls: ['./requirement-edit-dialog.component.scss']
})
export class RequirementEditDialogComponent implements OnInit, OnDestroy {
  display: boolean = false;
  showDialogSubscription!: Subscription;

  editMode: boolean = false;
  editRequirement!: IRequirement | null;

  constructor(private exerciseDialogService: ExerciseDialogService) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showEditRequirementDialogObservable.subscribe(options => {
      if (options?.requirement) {
        this.editMode = true;
        this.editRequirement = options.requirement;
      } else {
        this.editMode = false;
      }
      this.showDialog();
    });
  }

  showDialog() {
    this.display = true;
  }

  ngOnDestroy(): void {
    if (this.showDialogSubscription) {
      this.showDialogSubscription.unsubscribe();
    }
  }

}
