import { IRequirement } from './irequirement';
import { ISubRequirement } from './isub-requirement';

export class ClassRequirement implements IRequirement {
    type: string = 'class';
    classId: number;
    name: string;
    isAbstract: boolean;
    isInterface: boolean;
    relatedRequirements: ISubRequirement[];

    constructor(options: {
        classId: number,
        name?: string,
        isAbstract?: boolean,
        isInterface?: boolean,
        relatedRequirements?: ISubRequirement[]
    }) {
        this.classId = options.classId;
        this.name = options.name || '';
        this.isAbstract = options.isAbstract || false;
        this.isInterface = options.isInterface || false;
        this.relatedRequirements = options.relatedRequirements || [];
    }

    getExportData() {
        const subRequirementsExportData: any[] = [];
        for (let req of this.relatedRequirements) {
            subRequirementsExportData.push(req.getExportData());
        }

        return {
            type: this.type,
            class_id: this.classId,
            name: this.name,
            is_abstract: this.isAbstract,
            is_interface: this.isInterface,
            related_requirements: subRequirementsExportData
        };
    }
}
