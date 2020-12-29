export class RequirementType {
    name: string;
    typeArguments: RequirementType[];

    constructor(options: {
        name?: string,
        typeArguments?: RequirementType[]
    }) {
        this.name = options.name || '';
        this.typeArguments = options.typeArguments || [];
    }
}