import { ClassRequirement } from "src/app/models/requirements/class-requirement";
import { RequirementMethod } from "src/app/models/requirements/requirement-method";

export interface IMethodAnalyser {

    getClassMethods(classReq: ClassRequirement): RequirementMethod[] | undefined;

    addClassMethod(classReq: ClassRequirement, method: RequirementMethod): void;

    getClasses(): IterableIterator<ClassRequirement>;

}


export class MethodAnalyser implements IMethodAnalyser {

    private classMethods: Map<ClassRequirement, RequirementMethod[]>;

    constructor() {
        this.classMethods = new Map();
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

    getClasses(): IterableIterator<ClassRequirement> {
        return this.classMethods.keys();
    }

}