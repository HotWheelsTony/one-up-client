export interface ApiResponse<T> {
    data: T | T[];
    links: {
        prev?: string;
        next?: string;
    }
}