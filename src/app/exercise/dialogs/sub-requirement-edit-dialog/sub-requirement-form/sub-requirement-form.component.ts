import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { ConstructorType } from 'src/app/models/constructor-type';
import { MethodType } from 'src/app/models/method-type';
import { ClassOverridesObjectMethodSubRequirement } from 'src/app/models/requirements/class-overrides-object-method-sub-requirement';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ConstructorCallInConstructorRequirement } from 'src/app/models/requirements/constructor-call-in-constructor-sub-requirement';
import { ContainsSubRequirement } from 'src/app/models/requirements/contains-sub-requirement';
import { ExtendNameRequirement } from 'src/app/models/requirements/extend-name-requirement';
import { ExtendSubRequirement } from 'src/app/models/requirements/extend-sub-requirement';
import { ClassHasConstructorRequirement } from 'src/app/models/requirements/has-constructor-sub-requirement';
import { ClassHasFieldRequirement } from 'src/app/models/requirements/has-field-sub-requirement';
import { ClassHasMethodRequirement } from 'src/app/models/requirements/has-method-sub-requirement';
import { ImplementNameRequirement } from 'src/app/models/requirements/implement-name-requirement';
import { IRequirement } from 'src/app/models/requirements/irequirement';
import { MethodCallInConstructorRequirement } from 'src/app/models/requirements/method-call-in-constructor-sub-requirement';
import { MethodCallInMethodRequirement } from 'src/app/models/requirements/method-call-in-method-sub-requirement';
import { RequirementMethod } from 'src/app/models/requirements/requirement-method';
import { SubRequirementType } from 'src/app/models/sub-requirement-type';
import { ExerciseDialogService } from '../../exercise-dialog.service';

@Component({
  selector: 'app-sub-requirement-form',
  templateUrl: './sub-requirement-form.component.html',
  styleUrls: ['./sub-requirement-form.component.scss']
})
export class SubRequirementFormComponent implements OnInit, OnChanges, OnDestroy {
  classSubRequirementForm!: FormGroup | null;
  formHeader!: string;
  methodType = MethodType;
  constructorType = ConstructorType;

  subscriptions: Subscription[] = [];

  @Input() editMode: boolean = false;
  @Input() editSubRequirement!: IRequirement | null;
  @Input() parentRequirement!: IRequirement | null;
  @Input() subRequirementType!: SubRequirementType;

  relationTypes: { label: string, value: string }[] = [
    { label: 'One-To-One', value: 'one_to_one' },
    { label: 'One-To-Many', value: 'one_to_many' }
  ];
  modifiers: { label: string, value: string }[] = [
    { label: 'Private', value: 'PRIVATE' },
    { label: 'Public', value: 'PUBLIC' },
    { label: 'Protected', value: 'PROTECTED' },
    { label: 'Static', value: 'STATIC' },
    { label: 'Abstract', value: 'ABSTRACT' }
  ];
  objectMethods: { label: string, value: string }[] = [
    { label: 'clone', value: 'CLONE' },
    { label: 'Equals', value: 'EQUALS' },
    { label: 'hashCode', value: 'HASH_CODE' },
    { label: 'toString', value: 'TO_STRING' },
    { label: 'Comparable - compareTo', value: 'COMPARABLE_COMPARE_TO' }
  ];
  currentExerciseClassList: { id: number, name: string }[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private exerciseDialogService: ExerciseDialogService
  ) {
    this.currentExerciseClassList = this.exerciseService.getCurrentExerciseClassList();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.initializeClassRequirementForm();
    this.initializeSubscriptions();
  }

  initializeClassRequirementForm() {
    if (this.subRequirementType && this.parentRequirement) {
      switch (this.subRequirementType) {
        case SubRequirementType.EXTEND:
          this.formHeader = 'Extend Type Requirement';
          this.classSubRequirementForm = new FormGroup({
            // mainClass: new FormControl('', [Validators.required]),
            extendClass: new FormControl('', [
              Validators.required,
              this.restictedClassNameValidator((this.parentRequirement as ClassRequirement).name)
            ]),
          });
          break;
        case SubRequirementType.CONTAINS:
          this.formHeader = 'Contain Type Requirement';
          this.classSubRequirementForm = new FormGroup({
            // mainClass: new FormControl('', [Validators.required]),
            containClass: new FormControl('', [Validators.required]),
            relationType: new FormControl('', [Validators.required]),
          });
          break;
        case SubRequirementType.EXTEND_NAME:
          this.formHeader = 'Extends Class by name Requirement';
          this.classSubRequirementForm = new FormGroup({
            extendTypeName: new FormControl('', [Validators.required])
          });
          break;
        case SubRequirementType.IMPLEMENT_NAME:
          this.formHeader = 'Implements interface by name Requirement';
          this.classSubRequirementForm = new FormGroup({
            implementTypeName: new FormControl('', [Validators.required])
          });
          break;
        case SubRequirementType.CONTAINS_FIELD:
          this.formHeader = 'Contain Field Requirement';
          this.classSubRequirementForm = new FormGroup({
            fieldName: new FormControl('', [Validators.required]),
            modifiers: new FormControl(''),
            type: new FormControl('', [Validators.required]),
            includeSetter: new FormControl(false),
            includeGetter: new FormControl(false),
          });
          break;
        case SubRequirementType.METHOD:
          this.formHeader = 'Contain Method Requirement';
          this.classSubRequirementForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            modifiers: new FormControl(''),
            type: new FormControl('', [Validators.required]),
            parameters: new FormArray([]),
            overridingSuperClassMethod: new FormControl(''),
            overridingSuperClassMethodName: new FormControl('')
          });
          break;
        case SubRequirementType.CONSTRUCTOR:
          this.formHeader = 'Contain Constructor Requirement';
          this.classSubRequirementForm = new FormGroup({
            modifiers: new FormControl(''),
            parameters: new FormArray([])
          });
          break;
        case SubRequirementType.OVERRIDE_OBJECT_METHOD:
          this.formHeader = 'Override Object Method Requirement';
          this.classSubRequirementForm = new FormGroup({
            objectMethod: new FormControl('', [Validators.required])
          });
          break;
        case SubRequirementType.METHOD_CALL_METHOD:
          this.formHeader = 'Method Call Inside Method Requirement';
          this.classSubRequirementForm = new FormGroup({
            method: new FormGroup({
              name: new FormControl('', [Validators.required]),
              modifiers: new FormControl(''),
              type: new FormControl('', [Validators.required]),
              parameters: new FormArray([])
            }),
            callMethod: new FormGroup({
              name: new FormControl('', [Validators.required]),
              modifiers: new FormControl(''),
              type: new FormControl('', [Validators.required]),
              parameters: new FormArray([])
            }),
            callMethodClassName: new FormControl('', [Validators.required]),
            isCallMethodClassSuperClass: new FormControl('')
          });
          break;
        case SubRequirementType.CONSTRUCTOR_CALL_METHOD:
          this.formHeader = 'Method Call Inside Constructor Requirement';
          this.classSubRequirementForm = new FormGroup({
            constructorMethod: new FormGroup({
              modifiers: new FormControl(''),
              parameters: new FormArray([])
            }),
            callMethod: new FormGroup({
              name: new FormControl('', [Validators.required]),
              modifiers: new FormControl(''),
              type: new FormControl('', [Validators.required]),
              parameters: new FormArray([])
            }),
            callMethodClassName: new FormControl('', [Validators.required])
          });
          break;
        case SubRequirementType.CONSTRUCTOR_CALL_CONSTRUCTOR:
          this.formHeader = 'Super Constructor Call Inside Constructor Requirement';
          this.classSubRequirementForm = new FormGroup({
            constructorMethod: new FormGroup({
              modifiers: new FormControl(''),
              parameters: new FormArray([])
            }),
            callConstructor: new FormGroup({
              modifiers: new FormControl(''),
              parameters: new FormArray([])
            })
          });
          break;
        default:
          this.classSubRequirementForm = null;
          break;
      }
      if (this.editMode && this.editSubRequirement) {
        this.initializeEditFormValue();
      }
    }
  }

  initializeEditFormValue() {
    if (this.classSubRequirementForm) {
      switch (this.subRequirementType) {
        case SubRequirementType.EXTEND:
          this.classSubRequirementForm.patchValue({
            extendClass: (this.editSubRequirement as ExtendSubRequirement).extendClass.classId
          });
          break;
        case SubRequirementType.CONTAINS:

          this.classSubRequirementForm.patchValue({
            containClass: (this.editSubRequirement as ContainsSubRequirement).containClass.classId,
            relationType: (this.editSubRequirement as ContainsSubRequirement).relationType
          });
          break;
        case SubRequirementType.CONTAINS_FIELD:

          this.classSubRequirementForm.patchValue({
            fieldName: (this.editSubRequirement as ClassHasFieldRequirement).field.name,
            modifiers: (this.editSubRequirement as ClassHasFieldRequirement).field.modifiers,
            type: this.exerciseService.stringifyType((this.editSubRequirement as ClassHasFieldRequirement).field.type),
            includeSetter: (this.editSubRequirement as ClassHasFieldRequirement).includeSetter,
            includeGetter: (this.editSubRequirement as ClassHasFieldRequirement).includeGetter
          });
          break;
        case SubRequirementType.EXTEND_NAME:

          this.classSubRequirementForm.patchValue({
            extendTypeName: (this.editSubRequirement as ExtendNameRequirement).extendTypeName,
          });
          break;
        case SubRequirementType.IMPLEMENT_NAME:

          this.classSubRequirementForm.patchValue({
            implementTypeName: (this.editSubRequirement as ImplementNameRequirement).implementTypeName,
          });
          break;
        case SubRequirementType.METHOD:

          for (let p of (this.editSubRequirement as ClassHasMethodRequirement).method.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            (this.classSubRequirementForm.controls.parameters as FormArray).push(parameterGroup);
          }

          this.classSubRequirementForm.patchValue({
            name: (this.editSubRequirement as ClassHasMethodRequirement).method.name,
            modifiers: (this.editSubRequirement as ClassHasMethodRequirement).method.modifiers,
            type: this.exerciseService.stringifyType((this.editSubRequirement as ClassHasMethodRequirement).method.type),
            overridingSuperClassMethod: (this.editSubRequirement as ClassHasMethodRequirement).overridingSuperClassMethod,
            overridingSuperClassMethodName: (this.editSubRequirement as ClassHasMethodRequirement).overridingSuperClassMethodName
          });

          break;
        case SubRequirementType.CONSTRUCTOR:

          for (let p of (this.editSubRequirement as ClassHasConstructorRequirement).constructorReq.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            (this.classSubRequirementForm.controls.parameters as FormArray).push(parameterGroup);
          }

          this.classSubRequirementForm.patchValue({
            modifiers: (this.editSubRequirement as ClassHasConstructorRequirement).constructorReq.modifiers
          });

          break;
        case SubRequirementType.OVERRIDE_OBJECT_METHOD:
          this.classSubRequirementForm.patchValue({
            objectMethod: (this.editSubRequirement as ClassOverridesObjectMethodSubRequirement).objectMethod
          });
          break;
        case SubRequirementType.METHOD_CALL_METHOD:

          for (let p of (this.editSubRequirement as MethodCallInMethodRequirement).method.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            ((this.classSubRequirementForm.controls.method as FormGroup).controls.parameters as FormArray).push(parameterGroup);
          }

          for (let p of (this.editSubRequirement as MethodCallInMethodRequirement).callMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            ((this.classSubRequirementForm.controls.callMethod as FormGroup).controls.parameters as FormArray).push(parameterGroup);
          }

          this.classSubRequirementForm.patchValue({
            method: {
              name: (this.editSubRequirement as MethodCallInMethodRequirement).method.name,
              modifiers: (this.editSubRequirement as MethodCallInMethodRequirement).method.modifiers,
              type: this.exerciseService.stringifyType((this.editSubRequirement as MethodCallInMethodRequirement).method.type)
            },
            callMethod: {
              name: (this.editSubRequirement as MethodCallInMethodRequirement).callMethod.name,
              modifiers: (this.editSubRequirement as MethodCallInMethodRequirement).callMethod.modifiers,
              type: this.exerciseService.stringifyType((this.editSubRequirement as MethodCallInMethodRequirement).callMethod.type)
            },
            callMethodClassName: (this.editSubRequirement as MethodCallInMethodRequirement).callMethodClassName,
            isCallMethodClassSuperClass: (this.editSubRequirement as MethodCallInMethodRequirement).isCallMethodClassSuperClass
          });

          break;
        case SubRequirementType.CONSTRUCTOR_CALL_METHOD:

          for (let p of (this.editSubRequirement as MethodCallInConstructorRequirement).constructorMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            ((this.classSubRequirementForm.controls.constructorMethod as FormGroup).controls.parameters as FormArray).push(parameterGroup);
          }

          for (let p of (this.editSubRequirement as MethodCallInConstructorRequirement).callMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            ((this.classSubRequirementForm.controls.callMethod as FormGroup).controls.parameters as FormArray).push(parameterGroup);
          }

          this.classSubRequirementForm.patchValue({
            constructorMethod: {
              modifiers: (this.editSubRequirement as MethodCallInConstructorRequirement).constructorMethod.modifiers,
            },
            callMethod: {
              name: (this.editSubRequirement as MethodCallInConstructorRequirement).callMethod.name,
              modifiers: (this.editSubRequirement as MethodCallInConstructorRequirement).callMethod.modifiers,
              type: this.exerciseService.stringifyType((this.editSubRequirement as MethodCallInConstructorRequirement).callMethod.type)
            },
            callMethodClassName: (this.editSubRequirement as MethodCallInConstructorRequirement).callMethodClassName
          });

          break;
        case SubRequirementType.CONSTRUCTOR_CALL_CONSTRUCTOR:

          for (let p of (this.editSubRequirement as ConstructorCallInConstructorRequirement).constructorMethod.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            ((this.classSubRequirementForm.controls.constructorMethod as FormGroup).controls.parameters as FormArray).push(parameterGroup);
          }

          for (let p of (this.editSubRequirement as ConstructorCallInConstructorRequirement).callConstructor.parameters) {
            const parameterGroup = new FormGroup({
              name: new FormControl(''),
              type: new FormControl('')
            });
            parameterGroup.patchValue({
              name: p.name,
              type: this.exerciseService.stringifyType(p.type)
            });
            ((this.classSubRequirementForm.controls.callConstructor as FormGroup).controls.parameters as FormArray).push(parameterGroup);
          }

          this.classSubRequirementForm.patchValue({
            constructorMethod: {
              modifiers: (this.editSubRequirement as ConstructorCallInConstructorRequirement).constructorMethod.modifiers,
            },
            callConstructor: {
              modifiers: (this.editSubRequirement as ConstructorCallInConstructorRequirement).callConstructor.modifiers,
            }
          });

          break;
        default:
          this.classSubRequirementForm = null;
          break;
      }
    }
  }

  initializeSubscriptions() {
    this.subscriptions.push(this.exerciseDialogService.methodSelectedObservable.subscribe((res) => {
    }));
  }

  toggleFormControlFromCheckbox(event: any, control: AbstractControl) {
    if (event.checked) {
      control.enable();
    } else {
      control.disable();
    }
  }

  isControlInvalid(control: AbstractControl): boolean {
    return control.invalid && control.dirty;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors?.required) { return 'This field is required' }
    return ''
  }

  isFormValid(): boolean {
    if (this.classSubRequirementForm) {
      return this.classSubRequirementForm.valid;
    } else {
      return false;
    }
  }

  getFormValue(): any {
    if (this.classSubRequirementForm) {
      return this.classSubRequirementForm.getRawValue();
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subRequirementType) {
      if (changes.subRequirementType.currentValue === changes.subRequirementType.previousValue) {
        this.classSubRequirementForm?.reset();
      } else {
        this.initializeClassRequirementForm();
      }
    }
  }

  private restictedClassNameValidator(...restrictedNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      for (let c of restrictedNames) {
        if (control.value === c) {
          return { restrictedName: true };
        }
      }
      return null;
    }
  }

  getParameters(): FormArray {
    return (this.classSubRequirementForm?.controls.parameters as FormArray);
  }

  getMethodParameters(): FormArray {
    return ((this.classSubRequirementForm?.controls.method as FormGroup).controls.parameters as FormArray);
  }

  getCallMethodParameters(): FormArray {
    return ((this.classSubRequirementForm?.controls.callMethod as FormGroup).controls.parameters as FormArray);
  }

  getConstructorMethodParameters(): FormArray {
    return ((this.classSubRequirementForm?.controls.constructorMethod as FormGroup).controls.parameters as FormArray);
  }

  getCallConstructorParameters(): FormArray {
    return ((this.classSubRequirementForm?.controls.callConstructor as FormGroup).controls.parameters as FormArray);
  }

  addParameter() {
    this.getParameters().push(new FormGroup({
      name: new FormControl(''),
      type: new FormControl('')
    }));
  }

  addMethodParameter() {
    this.getMethodParameters().push(new FormGroup({
      name: new FormControl(''),
      type: new FormControl('')
    }));
  }

  addCallMethodParameter() {
    this.getCallMethodParameters().push(new FormGroup({
      name: new FormControl(''),
      type: new FormControl('')
    }));
  }

  addConstructorMethodParameter() {
    this.getConstructorMethodParameters().push(new FormGroup({
      name: new FormControl(''),
      type: new FormControl('')
    }));
  }

  addCallConstructorParameter() {
    this.getCallConstructorParameters().push(new FormGroup({
      name: new FormControl(''),
      type: new FormControl('')
    }));
  }

  removeParameter(index: number) {
    this.getParameters().removeAt(index);
  }

  removeMethodParameter(index: number) {
    this.getMethodParameters().removeAt(index);
  }

  removeCallMethodParameter(index: number) {
    this.getCallMethodParameters().removeAt(index);
  }

  removeConstructorMethodParameter(index: number) {
    this.getConstructorMethodParameters().removeAt(index);
  }

  removeCallConstructorParameter(index: number) {
    this.getCallConstructorParameters().removeAt(index);
  }

  private differentClassesValidator(...classControlNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      for (let c1 of classControlNames) {
        for (let c2 of classControlNames) {
          if (control.get(c1)?.value === control.get(c2)?.value && c1 !== c2) {
            return { sameClassname: true };
          }
        }
      }
      return null;
    }
  }

  asFormGroup(fg: any): FormGroup {
    return fg as FormGroup;
  }

  openPickMethodDialog(mehtodType: MethodType, mustBeFromCurrentClass: boolean) {
    if (this.classSubRequirementForm) {
          this.exerciseDialogService.showPickMethodDialog({ formGroup: this.classSubRequirementForm, mehtodType: mehtodType });
    }
  }

  openPickConstructorDialog(constructorType: ConstructorType, mustBeFromCurrentClass: boolean) {
    if (this.classSubRequirementForm) {
          this.exerciseDialogService.showPickConstructorDialog({ formGroup: this.classSubRequirementForm, constructorType: constructorType });
    }
  }

}
