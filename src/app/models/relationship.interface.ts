export interface Relationship {
    data: {
        type: string,
        id: string
    };
    links: {
        self: string,
        related: string
    }
}