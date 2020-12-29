import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { Exercise } from '../models/exercise';
import { ClassRequirement } from '../models/requirements/class-requirement';
import { ContainsSubRequirement } from '../models/requirements/contains-sub-requirement';
import { ExtendSubRequirement } from '../models/requirements/extend-sub-requirement';
import { IRequirement } from '../models/requirements/irequirement';
import { ISubRequirement } from '../models/requirements/isub-requirement';
import { map } from 'rxjs/operators';
import { SubRequirementFormComponent } from './dialogs/sub-requirement-edit-dialog/sub-requirement-form/sub-requirement-form.component';
import { SubRequirementType } from '../models/sub-requirement-type';
import { ProjectInfo } from '../models/project-info';
import { ExerciseFileService } from './file/exercise-file.service';
import { FieldRequirement } from '../models/requirements/field-requirement';
import { ClassHasFieldRequirement } from '../models/requirements/has-field-sub-requirement';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private currentExerciseSubject!: BehaviorSubject<Exercise | null>;
  public currentExerciseObservable: Observable<Exercise | null>;

  private maxClassId: number = -1;
  private currentExerciseValue!: Exercise;

  constructor(private exerciseFileService: ExerciseFileService) {
    this.currentExerciseSubject = new BehaviorSubject<Exercise | null>(null);
    this.currentExerciseObservable = this.currentExerciseSubject.asObservable();
  }

  public get userValue(): Exercise | null {
    return this.currentExerciseSubject.value;
  }

  exportExercise() {
    return this.exerciseFileService.exportExercisePackage(this.currentExerciseValue.getExportData());
  }

  createExercise(options: { exerciseDetailsData: ExerciseData }): Observable<Exercise> {
    return this.exerciseFileService.createNewExerciseFile({ exerciseDetailsData: options.exerciseDetailsData }).pipe(map((data: any) => {
      const exercise = this.createExerciseByJson(data);
      this.currentExerciseSubject.next(exercise);
      this.currentExerciseValue = exercise;
      return exercise;
    }));
  }

  openExerciseByJsonObject(jsonStringData: any) {
    const exercise: Exercise = this.createExerciseByJson(jsonStringData);
    this.currentExerciseSubject.next(exercise);
    this.currentExerciseValue = exercise;
    return exercise;
  }

  createExerciseByJson(jsonData: any) {
    this.maxClassId = -1;
    const exercise: Exercise = new Exercise({
      id: jsonData.id,
      name: jsonData.name,
      targets: jsonData.targets,
      projectInfo: new ProjectInfo({
        title: jsonData.exercise_project_info.title,
        startingProject: jsonData.exercise_project_info.starting_project
      })
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
      name: reqData.name,
      isAbstract: reqData.is_abstract
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
              relationType: subReq.relation_type
            }));
            break;
          case 'extend':
            subRequirementsList.push(new ExtendSubRequirement({
              mainClass: currentClass,
              extendClass: this.getClassById(classList, subReq.extend_class_id) || currentClass
            }));
            break;
          case 'contains-field':
            subRequirementsList.push(new ClassHasFieldRequirement({
              mainClass: currentClass,
              field: new FieldRequirement({
                name: subReq.field.name,
                type: this.stringifyType(subReq.field.type),
                modifiers: subReq.field.modifiers
              })
            }));
            break;
          default:
            break;
        }
      }
    }

    currentClass.relatedRequirements = subRequirementsList;
  }

  getCurrentExerciseClassList(): { id: number, name: string }[] {
    const classList: { id: number, name: string }[] = [];
    for (let req of this.currentExerciseValue.requirements) {
      if (req.type === 'class') {
        classList.push({ id: (req as ClassRequirement).classId, name: (req as ClassRequirement).name });
      }
    }
    return classList;
  }

  private getNewClassId(): number {
    return ++this.maxClassId;
  }

  addRequirementToCurrentExercise(options: { type: string, requirementData: any }): Observable<any> {
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

  editRequirement(options: { requirement: IRequirement, newValue: any }) {

    // Check if the name already exists
    for (let req of this.currentExerciseValue.requirements) {
      if (req.type === 'class' && (req as ClassRequirement).name === options.newValue.className &&
        (req as ClassRequirement).classId !== (options.requirement as ClassRequirement).classId) {
        return throwError(new Error('Class with this class name already exists'));
      }
    }

    // Update class requirement data
    (options.requirement as ClassRequirement).name = options.newValue.className;
    (options.requirement as ClassRequirement).isAbstract = options.newValue.isAbstract;

    this.currentExerciseSubject.next(this.currentExerciseValue);
    return of(this.currentExerciseValue);
  }

  checkSubRequirementExists(parentRequirement: IRequirement, subRequirement: IRequirement) {
    for (let req of (parentRequirement as ClassRequirement).relatedRequirements) {
      switch (subRequirement.type) {
        case SubRequirementType.CONTAINS:
          if (req.type === SubRequirementType.CONTAINS) {
            const reqAsContains = req as ContainsSubRequirement;
            const subReqAsContains = subRequirement as ContainsSubRequirement;
            if (reqAsContains.containClass === subReqAsContains.containClass &&
              reqAsContains.relationType === subReqAsContains.relationType) {
              return true;
            }
          }
          break;
        case SubRequirementType.EXTEND:
          if (req.type === SubRequirementType.EXTEND) {
            const reqAsExtend = req as ExtendSubRequirement;
            const subReqAsExtend = subRequirement as ExtendSubRequirement;
            if (reqAsExtend.extendClass === subReqAsExtend.extendClass) {
              return true;
            }
          }
          break;
        default:
          break;
      }
    }
    return false;
  }

  addSubRequirementToRequirement(options: { parentRequirement: IRequirement, type: SubRequirementType, subRequirementData: any }): Observable<any> {
    switch (options.type) {
      case SubRequirementType.CONTAINS:
        const containClass: ClassRequirement | null = this.getClassById(this.currentExerciseValue.requirements, options.subRequirementData.containClass);
        if (!containClass) {
          return throwError(new Error('Contain class not found'));
        }

        const containsRequirement = new ContainsSubRequirement({
          mainClass: options.parentRequirement as ClassRequirement,
          containClass: containClass,
          relationType: options.subRequirementData.relationType
        });

        if (this.checkSubRequirementExists(options.parentRequirement, containsRequirement)) {
          return throwError(new Error('Contains requirement already exists'));
        }

        (options.parentRequirement as ClassRequirement).relatedRequirements.push(containsRequirement);
        break;
      case SubRequirementType.EXTEND:
        const extendClass: ClassRequirement | null = this.getClassById(this.currentExerciseValue.requirements, Number.parseInt(options.subRequirementData.extendClass, 10));
        if (!extendClass) {
          return throwError(new Error('Extend class not found'));
        }

        const extendRequirement = new ExtendSubRequirement({
          mainClass: options.parentRequirement as ClassRequirement,
          extendClass: extendClass
        });

        if (this.checkSubRequirementExists(options.parentRequirement, extendRequirement)) {
          return throwError(new Error('Contains requirement already exists'));
        }

        (options.parentRequirement as ClassRequirement).relatedRequirements.push(extendRequirement);
        break;
      default:
        return throwError(new Error('Invalid subrequirement type'));
    }
    this.currentExerciseSubject.next(this.currentExerciseValue);
    return of(this.currentExerciseValue);
  }

  editSubRequirement(options: { parentRequirement: IRequirement, subRequirement: IRequirement, newValue: any }) {
    switch (options.subRequirement.type) {
      case SubRequirementType.CONTAINS:
        // check id the contain class exists
        const containClass: ClassRequirement | null = this.getClassById(this.currentExerciseValue.requirements, Number.parseInt(options.newValue.containClass, 10));
        if (!containClass) {
          return throwError(new Error('Extend class not found'));
        } else {
          (options.subRequirement as ContainsSubRequirement).containClass = containClass;
          (options.subRequirement as ContainsSubRequirement).relationType = options.newValue.relationType;
        }
        this.currentExerciseSubject.next(this.currentExerciseValue);
        return of(this.currentExerciseValue);
      case SubRequirementType.EXTEND:
        // check if class extends itself
        if (options.newValue.mainClass === options.newValue.extendClass) {
          return throwError(new Error('A class cannot extend itself'));
        }

        // check id the extend class exists
        const extendClass: ClassRequirement | null = this.getClassById(this.currentExerciseValue.requirements, Number.parseInt(options.newValue.extendClass, 10));
        if (!extendClass) {
          return throwError(new Error('Extend class not found'));
        } else {
          (options.subRequirement as ExtendSubRequirement).extendClass = extendClass;
        }
        this.currentExerciseSubject.next(this.currentExerciseValue);
        return of(this.currentExerciseValue);
      case SubRequirementType.CONTAINS_FIELD:
        // No checks here...
        
        this.currentExerciseSubject.next(this.currentExerciseValue);
        return of(this.currentExerciseValue);
      default:
        break;
    }

    return throwError(new Error('Invalid subrequirement type'));
  }

  saveExerciseDetails(options: { exercise: Exercise, exerciseDetailsData: ExerciseData }): Observable<any> {
    if (options.exerciseDetailsData.exerciseName === '' || options.exerciseDetailsData.projectTitle === '') {
      return throwError(new Error('Exercise name and exercise project title cannot be empty'));
    }

    options.exercise.name = options.exerciseDetailsData.exerciseName;
    options.exercise.projectInfo.title = options.exerciseDetailsData.projectTitle;
    options.exercise.projectInfo.startingProject = options.exerciseDetailsData.hasStartingProject;

    if (options.exerciseDetailsData.startingProjectUrl) {
      return this.exerciseFileService.updateExerciseZipProject({ fileUrl: options.exerciseDetailsData.startingProjectUrl });
    } else {
      this.currentExerciseSubject.next(options.exercise);
      return of(this.currentExerciseValue);
    }
  }

  stringifyType(type: any): string {
    if (!type) { return '' }
    const stringArray = [];
    stringArray.push(type.name);
    if (type.type_arguments && type.type_arguments.length > 0) {
      stringArray.push('<');
      for (let t of type.type_arguments) {
        this.stringifyTypeRecursive(t, stringArray);
        if ((type.type_arguments as any[]).indexOf(t) + 1 !== (type.type_arguments as any[]).length) {
          stringArray.push(', ')
        }
      }
      stringArray.push('>');
    }
    return stringArray.join('');
  }

  private stringifyTypeRecursive(type: any, stringArray: string[]): void {
    if (!type) { return }
    stringArray.push(type.name);
    if (type.type_arguments && type.type_arguments.length > 0) {
      stringArray.push('<');
      for (let t of type.type_arguments) {
        this.stringifyTypeRecursive(t, stringArray);
        if ((type.type_arguments as any[]).indexOf(t) + 1 !== (type.type_arguments as any[]).length) {
          stringArray.push(', ')
        }
      }
      stringArray.push('>');
    }
  }

  parseType(typeString: string): any {

  }


}

export interface ExerciseData {
  exerciseName: string;
  projectTitle: string;
  startingProjectUrl: string;
  hasStartingProject: boolean
}
