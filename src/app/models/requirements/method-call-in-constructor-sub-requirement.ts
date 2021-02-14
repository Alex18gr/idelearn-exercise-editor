import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";
import { RequirementConstructor } from "./requirement-constructor";
import { RequirementMethod } from "./requirement-method";

export class MethodCallInConstructorRequirement implements ISubRequirement {
    type: string = 'constructor-call-method';
    mainClass: ClassRequirement;
    constructorMethod: RequirementConstructor;
    callMethod: RequirementMethod;
    callMethodClassName: string;

    constructor(options: {
        mainClass: ClassRequirement,
        constructorMethod: RequirementConstructor,
        callMethod: RequirementMethod,
        callMethodClassName: string
    }) {
        this.mainClass = options.mainClass;
        this.constructorMethod = options.constructorMethod;
        this.callMethod = options.callMethod;
        this.callMethodClassName = options.callMethodClassName
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            constructor_method: this.constructorMethod,
            call_method: this.callMethod,
            call_method_class_name: this.callMethodClassName
        };
    }
}