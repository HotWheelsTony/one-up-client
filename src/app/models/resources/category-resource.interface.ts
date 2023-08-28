import { Identifier } from "../identifier.interface";

export interface CategoryResource {
    type: string;
    id: string;

    attributes: {
        name: string
    };

    relationships: {
        parent: {
            data: Identifier
        },
        children: {
            data: Identifier[]
        }
    };
}