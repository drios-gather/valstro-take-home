export interface QueryError {
    page: -1,
    resultCount: -1,
    // Handles both custom and axios errors from server
    error: string | { message: string }
}

export interface QueryResult {
    page: number,
    resultCount: number,
    name: string,
    films: string[]
}
