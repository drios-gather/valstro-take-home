export interface QueryError {
    page: -1,
    resultCount: -1,
    // Handles both custom and axios errors from server
    // The axios type is intentionally partial: errors include more than just a 'message' field, but
    // no more detailed information is required at the moment
    error: string | { message: string }
}

export interface QueryResult {
    page: number,
    resultCount: number,
    name: string,
    films: string[]
}
