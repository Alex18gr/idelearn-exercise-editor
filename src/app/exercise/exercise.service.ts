import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { Exercise } from '../models/exercise';
import exercise01 from '../models/mocks/01';
import { ClassRequirement } from '../models/requirements/class-requirement';
import { ContainsSubRequirement } from '../models/requirements/contains-sub-requirement';
import { ExtendSubRequirement } from '../models/requirements/extend-sub-requirement';
import { IRequirement } from '../models/requirements/irequirement';
import { ISubRequirement } from '../models/requirements/isub-requirement';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private currentExerciseSubject!: BehaviorSubject<Exercise | null>;

  public currentExerciseObservable: Observable<Exercise | null>;

  private maxClassId: number = -1;
  private currentExerciseValue!: Exercise;

  constructor() {
    this.currentExerciseSubject = new BehaviorSubject<Exercise | null>(null);
    this.currentExerciseObservable = this.currentExerciseSubject.asObservable();
  }

  public get userValue(): Exercise | null {
    return this.currentExerciseSubject.value;
  }

  openExercise() {
    return of(this.createExerciseByJson(exercise01)).pipe(map((exercise) => {
      this.currentExerciseSubject.next(exercise);
      this.currentExerciseValue = exercise;
      return exercise;
    }));
  }

  createExerciseByJson(jsonData: any) {
    this.maxClassId = -1;
    const exercise: Exercise = new Exercise({
      id: jsonData.id,
      name: jsonData.name,
      targets: jsonData.targets
    });

    for (let req of jsonData.requirements) {
      if (req) {
        if (req.type === 'class') {
          exercise.requirements.push(this.createClassRequirement(req));
        }
      }
    }

    for (let req of jsonData.requirements) {
      if (req) {
        if (req.type === 'class') {
          this.createClassRequirementSubRequirements(req, this.getClassById(exercise.requirements, req.class_id), exercise.requirements);
        }
      }
    }

    return exercise;
  }

  getClassById(classRequirements: IRequirement[], id: any): ClassRequirement | null {
    for (let classReq of classRequirements) {
      if (classReq instanceof ClassRequirement) {
        if (classReq.classId && classReq.classId === id) {
          return classReq;
        }
      }
    }
    return null;
  }

  createClassRequirement(reqData: any): ClassRequirement {
    if (reqData.class_id > this.maxClassId) {
      this.maxClassId = reqData.class_id;
    }
    return new ClassRequirement({
      classId: reqData.class_id,
      name: reqData.name
    });
  }

  createClassRequirementSubRequirements(reqData: any, currentClass: ClassRequirement | null, classList: IRequirement[]): void {
    const subRequirementsList: ISubRequirement[] = [];

    if (currentClass == null) {
      return;
    }

    for (let subReq of reqData.related_requirements) {
      if (subReq && subReq.type) {
        switch (subReq.type) {
          case 'contains':
            subRequirementsList.push(new ContainsSubRequirement({
              mainClass: currentClass,
              containClass: this.getClassById(classList, subReq.contain_class_id) || currentClass,
              relationType: reqData.relation_type
            }));
            break;
          case 'extend':
            subRequirementsList.push(new ExtendSubRequirement({
              mainClass: currentClass,
              extendClass: this.getClassById(classList, subReq.contain_class_id) || currentClass
            }));
            break;
          default:
            break;
        }
      }
    }

    currentClass.relatedRequirements = subRequirementsList;
  }

  private getNewClassId(): number {
    return ++this.maxClassId;
  }

  addRequirementToCurrentExercise(options: {type: string, requirementData: any}): Observable<any> {
    for (let req of this.currentExerciseValue.requirements) {
      if (req.type === 'class' && (req as ClassRequirement).name === options.requirementData.className) {
        return throwError(new Error('Class with this class name already exists'));
      }
    }

    this.currentExerciseValue.requirements.push(new ClassRequirement({
      classId: this.getNewClassId(),
      name: options.requirementData.className,
    }));
    this.currentExerciseSubject.next(this.currentExerciseValue);
    return of(this.currentExerciseValue);
  }

  editRequirement(options: {requirement: IRequirement, newValue: any}) {
    // check if the name is the same as before
    if ((options.requirement as ClassRequirement).name === options.newValue.className) {
      return throwError(new Error('Class name is same as before'));
    }

    // Check if the name already exists
    for (let req of this.currentExerciseValue.requirements) {
      if (req.type === 'class' && (req as ClassRequirement).name === options.newValue.className) {
        return throwError(new Error('Class with this class name already exists'));
      }
    }

    (options.requirement as ClassRequirement).name = options.newValue.className;
    this.currentExerciseSubject.next(this.currentExerciseValue);
    return of(this.currentExerciseValue);
  }
}
