import { ClassRequirement } from "./class-requirement";
import { FieldRequirement } from "./field-requirement";
import { ISubRequirement } from "./isub-requirement";

export class ClassHasFieldRequirement implements ISubRequirement{
    type: string = 'contains-field';
    mainClass: ClassRequirement;
    field: FieldRequirement;

    constructor(options: {
        mainClass: ClassRequirement,
        field: FieldRequirement
    }) {
        this.mainClass = options.mainClass;
        this.field = options.field;
    }
    getExportData() {
        throw new Error("Method not implemented.");
    }
}