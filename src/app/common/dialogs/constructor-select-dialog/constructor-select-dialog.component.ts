import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ExerciseDialogService } from 'src/app/exercise/dialogs/exercise-dialog.service';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { ConstructorType } from 'src/app/models/constructor-type';
import { MethodType } from 'src/app/models/method-type';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { RequirementConstructor } from 'src/app/models/requirements/requirement-constructor';
import { RequirementMethod } from 'src/app/models/requirements/requirement-method';
import { ExerciseAnalyseService } from '../../service/mathod-analyser/exercise-analyse.service';
import { ExerciseAnalyser } from '../../service/mathod-analyser/exercise-analyser';

@Component({
  selector: 'app-constructor-select-dialog',
  templateUrl: './constructor-select-dialog.component.html',
  styleUrls: ['./constructor-select-dialog.component.scss']
})
export class ConstructorSelectDialogComponent implements OnInit {

  display: boolean = false;
  title: string = 'Pick Constructor';
  loadingData: boolean = false;
  showDialogSubscription: Subscription | undefined;
  exerciseAnalyser: ExerciseAnalyser | undefined;
  classesList: { label: string, value: ClassRequirement }[] = [];
  methodsList: { label: string, value: RequirementConstructor }[] = [];
  selectedClass: ClassRequirement | undefined;
  selectedConstructor: RequirementConstructor | undefined;
  formGroup: FormGroup | undefined;
  constructorType: ConstructorType | undefined;

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
    this.showDialogSubscription = this.exerciseDialogService.showPickConstructorDialogObservable.subscribe((options: { formGroup: FormGroup, constructorType: ConstructorType }) => {
      this.showDialog(options);
    });
  }

  showDialog(options: { formGroup: FormGroup, constructorType: ConstructorType }) {
    this.formGroup = options.formGroup;
    this.constructorType = options.constructorType;
    this.getConstructorData();
    this.display = true;
  }

  getConstructorData() {
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
    this.selectedConstructor = undefined;
    this.selectedClass = undefined;
    this.constructorType = undefined;
    this.display = false;
  }

  confirm() {
    if (this.selectedConstructor && this.formGroup && this.constructorType) {
      this.patchFormValue();
      // this.exerciseDialogService.methodSelected({ method: this.selectedMethod, formGroup: this.formGroup });
      this.hideDialog();
    }
  }

  patchFormValue() {
    if (this.selectedClass && this.selectedConstructor && this.formGroup) {
      const parametersArray: FormGroup[] = [];
      switch (this.constructorType) {
        case ConstructorType.CONSTRUCTOR_CALL_METHOD:
        case ConstructorType.CURRENT_CONSTRUCTOR_CALL_CONSTRUCTOR:
          for (let p of this.selectedConstructor.parameters) {
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
          (this.formGroup.controls.constructorMethod as FormGroup).controls.parameters = new FormArray(parametersArray);

          this.formGroup.patchValue({
            constructorMethod: {
              modifiers: this.selectedConstructor.modifiers,
            }
          });
          break;
        case ConstructorType.OTHER_CONSTRUCTOR_CALL_CONSTRUCTOR:
          for (let p of this.selectedConstructor.parameters) {
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
          (this.formGroup.controls.callConstructor as FormGroup).controls.parameters = new FormArray(parametersArray);

          this.formGroup.patchValue({
            callConstructor: {
              modifiers: this.selectedConstructor.modifiers,
            }
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
      this.getClassConstructors(selectedClass);
    }
  }

  getClassConstructors(selectedClass: ClassRequirement) {
    this.selectedConstructor = undefined;
    const classMehods = this.exerciseAnalyser?.getClassConstructors(selectedClass);
    this.methodsList = [];
    if (classMehods) {
      classMehods.forEach((value: RequirementConstructor) => {
        this.methodsList.push({
          label: this.exerciseService.getConstructorMethodSignature(value),
          value: value
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.showDialogSubscription) { this.showDialogSubscription.unsubscribe(); }
  }
}
