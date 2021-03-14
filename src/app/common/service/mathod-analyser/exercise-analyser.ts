import { ClassRequirement } from "src/app/models/requirements/class-requirement";
import { RequirementConstructor } from "src/app/models/requirements/requirement-constructor";
import { RequirementMethod } from "src/app/models/requirements/requirement-method";

export interface IExerciseAnalyser {

    getClassMethods(classReq: ClassRequirement): RequirementMethod[] | undefined;

    addClassMethod(classReq: ClassRequirement, method: RequirementMethod): void;

    getClassConstructors(classReq: ClassRequirement): RequirementConstructor[] | undefined;

    addClassConstructor(classReq: ClassRequirement, constructor: RequirementConstructor): void;

    getClasses(): ClassRequirement[];

    addClass(classReq: ClassRequirement): void;

}


export class ExerciseAnalyser implements IExerciseAnalyser {

    private classMethods: Map<ClassRequirement, RequirementMethod[]>;
    private classConstructors: Map<ClassRequirement, RequirementConstructor[]>;
    private classSet: Set<ClassRequirement>;

    constructor() {
        this.classMethods = new Map();
        this.classConstructors = new Map();
        this.classSet = new Set();
    }

    getClassConstructors(classReq: ClassRequirement): RequirementConstructor[] | undefined {
        return this.classConstructors.get(classReq);
    }

    addClassConstructor(classReq: ClassRequirement, constructor: RequirementConstructor): void {
        if (!this.classConstructors.has(classReq)) {
            this.classConstructors.set(classReq, []);
        }
        this.classConstructors.get(classReq)?.push(constructor);
    }

    addClass(classReq: ClassRequirement): void {
        this.classSet.add(classReq);
    }
    
    addClassMethod(classReq: ClassRequirement, method: RequirementMethod): void {
        if (!this.classMethods.has(classReq)) {
            this.classMethods.set(classReq, []);
        }
        this.classMethods.get(classReq)?.push(method);
    }

    getClassMethods(classReq: ClassRequirement): RequirementMethod[] | undefined {
        return this.classMethods.get(classReq);
    }

    getClasses(): ClassRequirement[] {
        // return Array.from(this.classMethods.keys());
        return Array.from(this.classSet);
    }

}