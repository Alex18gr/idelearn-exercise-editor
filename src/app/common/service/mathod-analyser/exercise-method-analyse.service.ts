import { Injectable } from '@angular/core';
import { ExerciseService } from 'src/app/exercise/exercise.service';
import { Exercise } from 'src/app/models/exercise';
import { ClassRequirement } from 'src/app/models/requirements/class-requirement';
import { ClassHasMethodRequirement } from 'src/app/models/requirements/has-method-sub-requirement';
import { MethodAnalyser } from './method-analyser';

@Injectable({
  providedIn: 'root'
})
export class ExerciseMethodAnalyseService {

  private methodAnalyser: MethodAnalyser;

  constructor(
    private exerciseService: ExerciseService
  ) {
    this.methodAnalyser = new MethodAnalyser();
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
    this.methodAnalyser = new MethodAnalyser();
  }

  extractMethods(exercise: Exercise) {
    for (let req of exercise.requirements) {
      if (req instanceof ClassRequirement) {
        for (let subReq of req.relatedRequirements) {
          if (subReq instanceof ClassHasMethodRequirement) {
            this.methodAnalyser.addClassMethod(req, subReq.method);
          }
        }
      }
    }
  }


}
