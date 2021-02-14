import { ProjectInfo } from './project-info';
import { IRequirement } from './requirements/irequirement';

export class Exercise {
    id: string;
    name: string;
    targets: string[];
    description?: string;
    projectInfo: ProjectInfo;
    requirements: IRequirement[];
    

    constructor(options: {
        id: string,
        name: string,
        targets?: string[],
        description?: string,
        projectInfo: ProjectInfo,
        requirements?: IRequirement[]
    }) {
        this.id = options.id || '';
        this.name = options.name || '';
        this.targets = options.targets || [];
        this.description = options.description || '';
        this.projectInfo  = options.projectInfo;
        this.requirements = options.requirements || [];
    }

    getExportData() {
        const requirementsExportData: any[] = [];
        for (let req of this.requirements) {
            requirementsExportData.push(req.getExportData());
        }

        return {
            id: this.id,
            name: this.name,
            targets: this.targets,
            description: this.description,
            exercise_project_info: this.projectInfo.getExportData(),
            requirements: requirementsExportData
        };
    }
}
