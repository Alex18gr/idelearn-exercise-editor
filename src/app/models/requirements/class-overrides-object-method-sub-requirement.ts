import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";

export class ClassOverridesObjectMethodSubRequirement implements ISubRequirement {
    type: string = 'override-object-method';
    mainClass: ClassRequirement;
    objectMethod: ObjectMethod;

    constructor(options: {
        mainClass: ClassRequirement,
        objectMethod: ObjectMethod
    }) {
        this.mainClass = options.mainClass;
        this.objectMethod = options.objectMethod
    }

    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            object_method: this.objectMethod
        };
    }
}

enum ObjectMethod {
    CLONE = 'CLONE',
    EQUALS = 'EQUALS',
    HASH_CODE = 'HASH_CODE',
    TO_STRING = 'TO_STRING'
}