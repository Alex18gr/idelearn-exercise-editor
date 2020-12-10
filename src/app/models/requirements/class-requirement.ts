import { IRequirement } from './irequirement';
import { ISubRequirement } from './isub-requirement';

export class ClassRequirement implements IRequirement {
    type: string = 'class';
    classId: number;
    name: string;
    relatedRequirements: ISubRequirement[];

    constructor(options: {
        classId?: number,
        name?: string,
        relatedRequirements?: ISubRequirement[]
    }) {
        this.classId = options.classId || NaN;
        this.name = options.name || '';
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
            related_requirements: subRequirementsExportData
        };
    }
}
