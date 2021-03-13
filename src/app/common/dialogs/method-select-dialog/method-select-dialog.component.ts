import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExerciseDialogService } from 'src/app/exercise/dialogs/exercise-dialog.service';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { MethodType } from 'src/app/models/method-type';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { RequirementMethod } from 'src/app/models/requirements/requirement-method';
import { ExerciseAnalyseService } from '../../service/mathod-analyser/exercise-analyse.service';
import { ExerciseAnalyser } from '../../service/mathod-analyser/exercise-analyser';

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
  exerciseAnalyser: ExerciseAnalyser | undefined;
  classesList: { label: string, value: ClassRequirement }[] = [];
  methodsList: { label: string, value: RequirementMethod }[] = [];
  selectedClass: ClassRequirement | undefined;
  selectedMethod: RequirementMethod | undefined;
  formGroup: FormGroup | undefined;
  methodType: MethodType | undefined;

  constructor(
    private exerciseAnayseService: ExerciseAnalyseService,
    private exerciseDialogService: ExerciseDialogService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  initializeSubscriptions() {
    this.showDialogSubscription = this.exerciseDialogService.showPickMethodDialogObservable.subscribe((options: { formGroup: FormGroup, mehtodType: MethodType }) => {
      this.showDialog(options);
    });
  }

  showDialog(options: { formGroup: FormGroup, mehtodType: MethodType }) {
    this.formGroup = options.formGroup;
    this.methodType = options.mehtodType;
    this.getMehodData();
    this.display = true;
  }

  getMehodData() {
    this.exerciseAnalyser = this.exerciseAnayseService.exerciseAnalyser;
    this.classesList = [];
    this.exerciseAnalyser.getClasses().forEach((value: ClassRequirement) => {
      this.classesList.push({
        label: value.name,
        value: value
      });
    });
  }

  hideDialog() {
    this.formGroup = undefined;
    this.selectedMethod = undefined;
    this.selectedClass = undefined;
    this.methodType = undefined;
    this.display = false;
  }

  confirm() {
    if (this.selectedMethod && this.formGroup && this.methodType) {
      this.patchFormValue();
      this.exerciseDialogService.methodSelected({ method: this.selectedMethod, formGroup: this.formGroup });
      this.hideDialog();
    }
  }

  patchFormValue() {
    if (this.selectedClass && this.selectedMethod && this.formGroup) {
      const parametersArray: FormGroup[] = [];
      switch (this.methodType) {
        case MethodType.CONTAINS_METHOD:
          for (let p of this.selectedMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            parametersArray.push(parameterGroup);
          }
          (this.formGroup.controls.method as FormGroup).controls.parameters = new FormArray(parametersArray);

          this.formGroup.patchValue({
            method: {
              name: this.selectedMethod.name,
              modifiers: this.selectedMethod.modifiers,
              type: this.exerciseService.stringifyType(this.selectedMethod.type)
            }
          });
          break;
        case MethodType.CONTAINS_CALL_METHOD:
          for (let p of this.selectedMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            parametersArray.push(parameterGroup);
          }
          (this.formGroup.controls.callMethod as FormGroup).controls.parameters = new FormArray(parametersArray);

          this.formGroup.patchValue({
            callMethod: {
              name: this.selectedMethod.name,
              modifiers: this.selectedMethod.modifiers,
              type: this.exerciseService.stringifyType(this.selectedMethod.type)
            },
            callMethodClassName: this.selectedClass.name,
            isCallMethodClassSuperClass: false
          });
          break;
        case MethodType.CONSTRUCTOR_CALL_METHOD:
          for (let p of this.selectedMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            parametersArray.push(parameterGroup);
          }
          (this.formGroup.controls.callMethod as FormGroup).controls.parameters = new FormArray(parametersArray);

          this.formGroup.patchValue({
            callMethod: {
              name: this.selectedMethod.name,
              modifiers: this.selectedMethod.modifiers,
              type: this.exerciseService.stringifyType(this.selectedMethod.type)
            },
            callMethodClassName: this.selectedClass.name
          });
          break;
        default:
          break;
      }
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
    const classMehods = this.exerciseAnalyser?.getClassMethods(selectedClass);
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
