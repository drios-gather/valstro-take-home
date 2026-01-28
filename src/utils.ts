import { QueryError, QueryResult } from "./types/payload";

export const standardizeQuery = (query: string): string => {
    return query.toLowerCase().trim()
}

const formatFilms = (films: string[]): string => `[${films.join(', ')}]`

export const formatResult = (result: QueryResult): string => {
    return `(${result.page}/${result.resultCount}) ${result.name} - ${formatFilms(result.films)}`
}

export const formatError = (errorPayload: QueryError): string => {
    const errorMessage = typeof errorPayload.error === 'string' ? errorPayload.error : errorPayload.error.message
    return `Error: ${errorMessage}`
}

export const isError = (payload: QueryResult | QueryError): payload is QueryError => {
    return payload.page === -1
}

export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error && 'code' in error
}

export const isFinalResult = (result: QueryResult): boolean => result.page === result.resultCount
