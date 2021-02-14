import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementConstructor } from "./requirement-constructor";

export class ConstructorCallInConstructorRequirement implements ISubRequirement {
    type: string = 'constructor-call-constructor';
    mainClass: ClassRequirement;
    constructorMethod: RequirementConstructor;
    callConstructor: RequirementConstructor;

    constructor(options: {
        mainClass: ClassRequirement,
        constructorMethod: RequirementConstructor,
        callConstructor: RequirementConstructor
    }) {
        this.mainClass = options.mainClass;
        this.constructorMethod = options.constructorMethod;
        this.callConstructor = options.callConstructor;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            constructor_method: this.constructorMethod,
            call_constructor: this.callConstructor
        };
    }
}