export class RequirementType {
    name: string;
    type_arguments: RequirementType[];

    constructor(options: {
        name?: string,
        type_arguments?: RequirementType[]
    }) {
        this.name = options.name || '';
        this.type_arguments = options.type_arguments || [];
    }
}