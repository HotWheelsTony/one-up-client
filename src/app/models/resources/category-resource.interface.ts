import { Relationship } from "../relationship.interface";

export interface CategoryResource {
    type: string;
    id: string;

    attributes: {
        name: string
    };

    relationships: {
        parent: {
            data: Relationship
        },
        children: {
            data: Relationship[]
        }
    };
}