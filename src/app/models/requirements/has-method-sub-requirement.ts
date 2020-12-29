import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementMethod } from "./requirement-method";

export class ClassHasMethodRequirement implements ISubRequirement{
    type: string = 'method';
    mainClass: ClassRequirement;
    method: RequirementMethod;

    constructor(options: {
        mainClass: ClassRequirement,
        method: RequirementMethod
    }) {
        this.mainClass = options.mainClass;
        this.method = options.method;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            method: this.method
        };
    }
}