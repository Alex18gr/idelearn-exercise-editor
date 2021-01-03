import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementMethod } from "./requirement-method";

export class MethodCallInMethodRequirement implements ISubRequirement {
    type: string = 'method-call-method';
    mainClass: ClassRequirement;
    method: RequirementMethod;
    callMethod: RequirementMethod;
    callMethodClassName: string;

    constructor(options: {
        mainClass: ClassRequirement,
        method: RequirementMethod,
        callMethod: RequirementMethod,
        callMethodClassName: string
    }) {
        this.mainClass = options.mainClass;
        this.method = options.method;
        this.callMethod = options.callMethod;
        this.callMethodClassName = options.callMethodClassName
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            method: this.method,
            call_method: this.callMethod,
            call_method_class_name: this.callMethodClassName
        };
    }
}