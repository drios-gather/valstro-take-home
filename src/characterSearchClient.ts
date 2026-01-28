import { io, Socket } from "socket.io-client";
import { SearchRequestBody } from "./types/searchRequest";
import { formatError, formatResult, isError, isFinalResult, standardizeQuery } from "./utils";
import { QueryError, QueryResult } from "./types/payload";

const BACKEND_DOMAIN = "localhost"
const PORT = 3000

export class CharacterSearchClient {
    onConnect: () => void
    socket: Socket

    constructor(onConnect: () => void) {
        this.onConnect = onConnect

        this.socket = io(`http://${BACKEND_DOMAIN}:${PORT}`)
        console.log("===\nConnecting to server...")

        this.initListeners()
    }

    initListeners() {
        this.socket.on('connect', () => {
            console.log("Connected to server\n===")
            this.onConnect()
        })

        this.socket.on('disconnect', (reason, description) => {
            console.log(`\nDisconnected from server: ${reason}`)

            if (description !== undefined && 'description' in description) {
                console.log(`Description: ${JSON.stringify(description.description)}`)
            }
        })

        this.socket.on('connect_error', (err) => {
            console.error(`Connection error due to ${err.message}`)
        })
    }

    async search(query: string) {
        const queryObj: SearchRequestBody = { query: standardizeQuery(query) }

        return new Promise<void>((resolve, reject) => {
            const cleanup = () => this.socket.off("search", listener)
            const listener = (payload: QueryResult | QueryError) => {
                if (isError(payload)) {
                    cleanup()
                    reject(formatError(payload))
                    return
                }

                console.log(formatResult(payload))

                if (isFinalResult(payload)) {
                    cleanup()
                    resolve()
                }
            }

            this.socket.on("search", listener)
            this.socket.emit("search", queryObj)
        })
    }
}
