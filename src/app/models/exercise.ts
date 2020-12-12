import { ProjectInfo } from './project-info';
import { IRequirement } from './requirements/irequirement';

export class Exercise {
    id: string;
    name: string;
    targets: string[];
    projectInfo: ProjectInfo;
    requirements: IRequirement[];
    

    constructor(options: {
        id: string,
        name: string,
        targets?: string[],
        projectInfo: ProjectInfo,
        requirements?: IRequirement[]
    }) {
        this.id = options.id || '';
        this.name = options.name || '';
        this.targets = options.targets || [];
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
            exercise_project_info: this.projectInfo.getExportData(),
            requirements: requirementsExportData
        };
    }
}
