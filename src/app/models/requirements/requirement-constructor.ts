import { RequirementParameter } from "./requirement-parameter";

export class RequirementConstructor {
    modifiers: string[];
    parameters: RequirementParameter[];

    constructor(options: {
        modifiers?: string[],
        parameters?: RequirementParameter[]
    }) {
        this.modifiers = options.modifiers || [];
        this.parameters = options.parameters || [];
    }
}