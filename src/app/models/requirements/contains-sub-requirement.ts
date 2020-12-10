import { ClassRequirement } from './class-requirement';
import { ISubRequirement } from './isub-requirement';

export class ContainsSubRequirement implements ISubRequirement {
    type: string = 'contains';
    mainClass: ClassRequirement;
    containClass: ClassRequirement;
    relationType: RelationType;

    constructor(options: {
        mainClass: ClassRequirement,
        containClass: ClassRequirement,
        relationType: RelationType,
    }) {
        this.mainClass = options.mainClass;
        this.containClass = options.containClass;
        this.relationType = options.relationType;
    }

    getExportData() {
        return {
            type: this.type,
            main_class_id: this.mainClass.classId,
            contain_class_id: this.containClass.classId,
            relation_type: this.relationType
        };
    }

    
}

enum RelationType {
    ONE_TO_ONE = 'one_to_one',
    ONE_TO_MANY = 'one_to_many'
}
