import { ClassRequirement } from "./class-requirement";

export interface ISubRequirement {
    type: string;
    mainClass: ClassRequirement;
    getExportData(): any;
}
