import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Exercise } from '../models/exercise';
import exercise01 from '../models/mocks/01';
import { ClassRequirement } from '../models/requirements/class-requirement';
import { ContainsSubRequirement } from '../models/requirements/contains-sub-requirement';
import { ExtendSubRequirement } from '../models/requirements/extend-sub-requirement';
import { IRequirement } from '../models/requirements/irequirement';
import { ISubRequirement } from '../models/requirements/isub-requirement';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor() { }

  openExercise() {
    return of(this.createExerciseByJson(exercise01));
  }

  createExerciseByJson(jsonData: any) {
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
}
