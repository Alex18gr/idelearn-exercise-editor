import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";

export class ImplementNameRequirement implements ISubRequirement {
    type: string = 'implement-name';
    mainClass: ClassRequirement;
    implementTypeName: string;

    constructor(options: {
        mainClass: ClassRequirement,
        implementTypeName: string
    }) {
        this.mainClass = options.mainClass;
        this.implementTypeName = options.implementTypeName;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            implement_type_name: this.implementTypeName
        };
    }
}