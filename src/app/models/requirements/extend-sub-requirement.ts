import { ClassRequirement } from './class-requirement';
import { ISubRequirement } from './isub-requirement';

export class ExtendSubRequirement implements ISubRequirement {
    type: string = 'extend';
    mainClass: ClassRequirement;
    extendClass: ClassRequirement;

    constructor(options: {
        mainClass: ClassRequirement,
        extendClass: ClassRequirement
    }) {
        this.mainClass = options.mainClass;
        this.extendClass = options.extendClass;
    }

    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            extend_class_id: this.extendClass.classId
        };
    }
}
