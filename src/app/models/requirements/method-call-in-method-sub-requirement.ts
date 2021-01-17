import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementMethod } from "./requirement-method";

export class MethodCallInMethodRequirement implements ISubRequirement {
    type: string = 'method-call-method';
    mainClass: ClassRequirement;
    method: RequirementMethod;
    callMethod: RequirementMethod;
    callMethodClassName: string;
    isCallMethodClassSuperClass: boolean;

    constructor(options: {
        mainClass: ClassRequirement,
        method: RequirementMethod,
        callMethod: RequirementMethod,
        callMethodClassName: string,
        isCallMethodClassSuperClass?: boolean
    }) {
        this.mainClass = options.mainClass;
        this.method = options.method;
        this.callMethod = options.callMethod;
        this.callMethodClassName = options.callMethodClassName
        this.isCallMethodClassSuperClass = options.isCallMethodClassSuperClass || false;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            method: this.method,
            call_method: this.callMethod,
            call_method_class_name: this.callMethodClassName,
            is_call_method_class_super_class: this.isCallMethodClassSuperClass
        };
    }
}