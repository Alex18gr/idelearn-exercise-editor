import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementMethod } from "./requirement-method";

export class ClassHasMethodRequirement implements ISubRequirement {
    type: string = 'method';
    mainClass: ClassRequirement;
    method: RequirementMethod;
    overridingSuperClassMethod: boolean;
    overridingSuperClassMethodName: string;

    constructor(options: {
        mainClass: ClassRequirement,
        method: RequirementMethod,
        overridingSuperClassMethod?: boolean,
        overridingSuperClassMethodName?: string
    }) {
        this.mainClass = options.mainClass;
        this.method = options.method;
        this.overridingSuperClassMethod = options.overridingSuperClassMethod || false;
        this.overridingSuperClassMethodName = options.overridingSuperClassMethodName || '';
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            method: this.method,
            overriding_super_class_method: this.overridingSuperClassMethod,
            overriding_super_class_method_name: this.overridingSuperClassMethodName
        };
    }
}