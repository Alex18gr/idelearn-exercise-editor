import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface MethodFormValues {
  name: string;
  modifiers: string;
  type: string;
  parameters: string;
}

@Component({
  selector: 'app-method-form',
  templateUrl: './method-form.component.html',
  styleUrls: ['./method-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MethodFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MethodFormComponent),
      multi: true
    }
  ]
})
export class MethodFormComponent implements OnInit, ControlValueAccessor, OnDestroy {
  methodForm: FormGroup | undefined;
  subscriptions: Subscription[] = [];

  get value(): MethodFormValues {
    return this.methodForm?.value;
  }

  set value(value: MethodFormValues) {
    this.methodForm?.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  modifiers: { label: string, value: string }[] = [
    { label: 'Private', value: 'PRIVATE' },
    { label: 'Public', value: 'PUBLIC' },
    { label: 'Protected', value: 'PROTECTED' },
    { label: 'Static', value: 'STATIC' },
    { label: 'Abstract', value: 'ABSTRACT' }
  ];

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.methodForm?.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  initializeForm() {
    this.methodForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      modifiers: new FormControl(''),
      type: new FormControl('', [Validators.required]),
      parameters: new FormArray([])
    })
  }

  isControlInvalid(control: AbstractControl): boolean {
    return control.invalid && control.dirty;
  }

  asFormGroup(fg: any): FormGroup {
    return fg as FormGroup;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors?.required) { return 'This field is required' }
    return ''
  }

  getMethodParameters(): FormArray {
    return ((this.methodForm as FormGroup).controls.parameters as FormArray);
  }

  addMethodParameter() {
    this.getMethodParameters().push(new FormGroup({
      name: new FormControl(''),
      type: new FormControl('')
    }));
  }

  removeMethodParameter(index: number) {
    this.getMethodParameters().removeAt(index);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  

}
