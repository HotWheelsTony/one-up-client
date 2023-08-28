export interface ApiResponse<T> {
    data: T;
    links?: {
        prev?: string;
        next?: string;
    }
}