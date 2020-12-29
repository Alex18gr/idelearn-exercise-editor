import { RequirementParameter } from "./requirement-parameter";
import { RequirementType } from "./requirement-type";

export class RequirementMethod {
    name: string;
    modifiers: string[];
    type: RequirementType;
    parameters: RequirementParameter[];

    constructor(options: {
        name?: string,
        modifiers?: string[],
        type?: RequirementType,
        parameters?: RequirementParameter[]
    }) {
        this.name = options.name || '';
        this.modifiers = options.modifiers || [];
        this.type = options.type || new RequirementType({});
        this.parameters = options.parameters || [];
    }
}