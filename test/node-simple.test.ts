// @ts-nocheck
import { Client } from "../src";
import * as uuid from "uuid"
import { w3cwebsocket } from "websocket";

Object.assign(global, { WebSocket: w3cwebsocket });

if (process.env.TEST_BROKER_URL === undefined) {
    describe = describe.skip
}

describe('Node Simple MQ Test Suite', () => {

    it('should support push item to queue', async (done) => {
        const destination = `/queue/${uuid.v4()}`
        const testValue = uuid.v4()
        const client = new Client({
            brokerURL: process.env.TEST_BROKER_URL,
            connectHeaders: {
                login: 'admin',
                passcode: 'nimda',
                debug: console.log
            },
            onConnect: () => {
                client.subscribe(destination, (m) => {
                    expect(m.body).toBe(testValue)
                    client.deactivate()
                    done()
                })
                client.publish({ destination, body: testValue })
            },
            onStompError: done
        })

        await client.activate()



    });

});