export class ProjectInfo {
    title: string;
    startingProject: boolean;

    constructor(options: {
        title: string,
        startingProject: boolean
    }) {
        this.title = options.title || '';
        this.startingProject = options.startingProject || false;
    }

    getExportData() {
        return {
            title: this.title,
            starting_project: this.startingProject
        };
    }
}