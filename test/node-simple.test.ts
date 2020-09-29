// @ts-nocheck
import "jest"
import { createStompClient } from "../src";
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
        const client = await createStompClient({
            brokerURL: process.env.TEST_BROKER_URL,
            login: process.env.TEST_BROKER_LOGIN,
            passcode: process.env.TEST_BROKER_PASSCODE,
        })

        client.subscribe(destination, (m) => {
            expect(m.body).toBe(testValue)
            client.deactivate()
            done()
        })

        client.publish({ destination, body: testValue })

    });

    it('should raise error on ws error', async () => {
        const notExistService = 'ws://127.0.0.2:33/ws'
        await expect(
            () => createStompClient({ brokerURL: notExistService })
        ).rejects.toThrow(`First connect to ${notExistService} failed.`)
    });

});