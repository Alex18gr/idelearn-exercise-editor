import { Injectable } from '@angular/core';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ClassHasConstructorRequirement } from 'src/app/models/requirements/has-constructor-sub-requirement';
import { ClassHasMethodRequirement } from 'src/app/models/requirements/has-method-sub-requirement';
import { ExerciseAnalyser } from './exercise-analyser';

@Injectable({
  providedIn: 'root'
})
export class ExerciseAnalyseService {

  private _exerciseAnalyser: ExerciseAnalyser;
  
  public get exerciseAnalyser() : ExerciseAnalyser {
    return this._exerciseAnalyser;
  }
  

  constructor(
    private exerciseService: ExerciseService
  ) {
    this._exerciseAnalyser = new ExerciseAnalyser();
    this.exerciseService.currentExerciseObservable.subscribe((exercise: Exercise | null) => {
      if (exercise) {
        this.analyseExerciseMethods(exercise);
      }
    });
  }

  analyseExerciseMethods(exercise: Exercise) {
    
    // Initialize a new method analyser
    this.initializeClassMethodsMap()

    // extract methods
    this.extractMethods(exercise);

  }

  initializeClassMethodsMap() {
    this._exerciseAnalyser = new ExerciseAnalyser();
  }

  extractMethods(exercise: Exercise) {
    for (let req of exercise.requirements) {
      if (req instanceof ClassRequirement) {
        this._exerciseAnalyser.addClass(req);
        for (let subReq of req.relatedRequirements) {
          if (subReq instanceof ClassHasMethodRequirement) {
            this._exerciseAnalyser.addClassMethod(req, subReq.method);
          } else if (subReq instanceof ClassHasConstructorRequirement) {
            this._exerciseAnalyser.addClassConstructor(req, subReq.constructorReq);
          }
        }
      }
    }
  }


}
