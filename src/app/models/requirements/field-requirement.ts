import { RequirementType } from "./requirement-type";

export class FieldRequirement {
    name: string;
    modifiers: string[];
    type: RequirementType;

    constructor(options: {
        name?: string,
        modifiers?: string[],
        type?: RequirementType,
    }) {
        this.name = options.name || '';
        this.modifiers = options.modifiers || [];
        this.type = options.type || new RequirementType({});

    }
}