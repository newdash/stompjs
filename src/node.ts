import { Client } from "./client";
import { StompHeaders } from "./stomp-headers";


interface CreationOptions {
    brokerURL: string;
    headers?: StompHeaders;
    login?: string;
    passcode?: string;
}


export function createStompClient(options: CreationOptions): Promise<Client> {
    return new Promise((resolve, reject) => {
        let successfulConnected = false;
        const c = new Client({
            brokerURL: options.brokerURL,
            connectHeaders: Object.assign({}, { login: options.login, passcode: options.passcode }, options.headers),
            onConnect: () => {
                successfulConnected = true; resolve(c);
            },
            onWebSocketError: () => {
                if (successfulConnected === false) {
                    c.deactivate()
                    reject(new Error(`First connect to ${options.brokerURL} failed.`))
                }
            },
        })
        c.activate()
    })
}