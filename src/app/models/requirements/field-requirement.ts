export class FieldRequirement {
    name: string;
    modifiers: string[];
    type: string;

    constructor(options: {
        name?: string,
        modifiers?: string[],
        type: string
    }) {
        this.name = options.name || '';
        this.modifiers = options.modifiers || [];
        this.type = options.type || ''
    }
}