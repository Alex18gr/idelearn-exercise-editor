import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementConstructor } from "./requirement-constructor";

export class ClassHasConstructorRequirement implements ISubRequirement {
    type: string = 'constructor';
    mainClass: ClassRequirement;
    constructorReq: RequirementConstructor;

    constructor(options: {
        mainClass: ClassRequirement,
        constructorReq: RequirementConstructor
    }) {
        this.mainClass = options.mainClass;
        this.constructorReq = options.constructorReq;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            constructor_req: this.constructorReq
        };
    }
}