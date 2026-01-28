import readline from 'node:readline/promises';
import { isNodeError } from "./utils";
import { CharacterSearchClient } from "./characterSearchClient";

const characterSearchClient = new CharacterSearchClient(() => initUI())

async function initUI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Handle abort requests (CTRL + C) gracefully
    rl.on('close', () => {
        console.log('\nExiting from client (CTRL + C).')
        process.exit(0)
    })

    while (true) {
        try {
            const query = await rl.question('What character would you like to search for? ')
            console.log(`Searching for ${query}...\n--`);

            await characterSearchClient.search(query)
        } catch (err) {
            if (isNodeError(err) && err.code === 'ABORT_ERR') continue
            console.error(err)
        }

        console.log('--')
    }
}
