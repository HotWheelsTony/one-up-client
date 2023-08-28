export interface TagResource {
    type: string;
    id: string;

    relationships: {
        transactions: {
            links: {
                related: string;
            }
        }
    }
}