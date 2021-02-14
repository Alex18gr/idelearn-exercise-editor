import { ClassRequirement } from "./class-requirement";
import { FieldRequirement } from "./field-requirement";
import { ISubRequirement } from "./isub-requirement";

export class ClassHasFieldRequirement implements ISubRequirement {
    type: string = 'contains-field';
    mainClass: ClassRequirement;
    field: FieldRequirement;
    includeGetter?: boolean;
    includeSetter?: boolean;

    constructor(options: {
        mainClass: ClassRequirement,
        field: FieldRequirement,
        includeSetter?: boolean
        includeGetter?: boolean,
    }) {
        this.mainClass = options.mainClass;
        this.field = options.field;
        this.includeSetter = options.includeSetter || false;
        this.includeGetter = options.includeGetter || false;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            field: this.field,
            include_setter: this.includeSetter,
            include_getter: this.includeGetter
        };
    }
}