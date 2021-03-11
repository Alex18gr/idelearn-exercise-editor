import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExerciseDialogService } from 'src/app/exercise/dialogs/exercise-dialog.service';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { RequirementMethod } from 'src/app/models/requirements/requirement-method';
import { ExerciseMethodAnalyseService } from '../../service/mathod-analyser/exercise-method-analyse.service';
import { MethodAnalyser } from '../../service/mathod-analyser/method-analyser';

@Component({
  selector: 'app-method-select-dialog',
  templateUrl: './method-select-dialog.component.html',
  styleUrls: ['./method-select-dialog.component.scss']
})
export class MethodSelectDialogComponent implements OnInit, OnDestroy {
  display: boolean = false;
  title: string = 'Pick Method';
  loadingData: boolean = false;
  showDialogSubscription: Subscription | undefined;
  methodAnalyser: MethodAnalyser | undefined;
  classesList: { label: string, value: ClassRequirement }[] = [];
  methodsList: { label: string, value: RequirementMethod }[] = [];
  selectedClass: ClassRequirement | undefined;
  selectedMethod: RequirementMethod | undefined;
  control: string = '';

  constructor(
    private exerciseMethodAnayseService: ExerciseMethodAnalyseService,
    private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showPickMethodDialogObservable.subscribe((options: { control: string }) => {
      this.showDialog(options);
    });
  }

  showDialog(options: { control: string }) {
    this.control = options.control;
    this.getMehodData();
    this.display = true;
  }

  getMehodData() {
    this.methodAnalyser = this.exerciseMethodAnayseService.methodAnalyser;
    this.classesList = [];
    this.methodAnalyser.getClasses().forEach((value: ClassRequirement) => {
      this.classesList.push({
        label: value.name,
        value: value
      });
    });
  }

  hideDialog() {
    this.title = '';
    this.control = '';
    this.selectedMethod = undefined;
    this.selectedClass = undefined;
    this.display = false;
  }

  confirm() {
    if (this.selectedMethod) {
      this.exerciseDialogService.methodSelected({ method: this.selectedMethod, control: this.control });
      this.hideDialog();
    }
  }

  classDropdownValueChanged(event: any) {
    const selectedClass = event.value;
    if (selectedClass instanceof ClassRequirement) {
      this.getClassMethods(selectedClass);
    }
  }

  getClassMethods(selectedClass: ClassRequirement) {
    this.selectedMethod = undefined;
    const classMehods = this.methodAnalyser?.getClassMethods(selectedClass);
    this.methodsList = [];
    if (classMehods) {
      classMehods.forEach((value: RequirementMethod) => {
        this.methodsList.push({
          label: this.exerciseService.getMethodSignature(value),
          value: value
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.showDialogSubscription) { this.showDialogSubscription.unsubscribe(); }
  }

}
