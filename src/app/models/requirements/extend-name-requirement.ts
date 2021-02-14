import { ClassRequirement } from "./class-requirement";
import { ISubRequirement } from "./isub-requirement";

export class ExtendNameRequirement implements ISubRequirement {
    type: string = 'extend-name';
    mainClass: ClassRequirement;
    extendTypeName: string;

    constructor(options: {
        mainClass: ClassRequirement,
        extendTypeName: string
    }) {
        this.mainClass = options.mainClass;
        this.extendTypeName = options.extendTypeName;
    }
    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            extend_type_name: this.extendTypeName
        };
    }
}