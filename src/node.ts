import { Client } from "./client";
import { StompHeaders } from "./stomp-headers";
import { w3cwebsocket } from "websocket";

// apply polyfill
if (typeof global === "object" && global.WebSocket === undefined) {
    Object.assign(global, { WebSocket: w3cwebsocket });
}

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
                // if the client has connected to server before, skip reject and just allow it reconnect
                if (successfulConnected === false) {
                    c.deactivate() // shutdown client, disable re-connect
                    reject(new Error(`First connect to ${options.brokerURL} failed.`))
                }
            },
        })

        c.activate() // DO connect
    })
}