import { RequirementType } from "./requirement-type";

export class RequirementParameter {
    name: string;
    type: RequirementType;

    constructor(options: {
        name?: string,
        type?: RequirementType,
    }) {
        this.name = options.name || '';
        this.type = options.type || new RequirementType({});

    }
}