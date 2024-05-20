import { test } from 'node:test'
import { strict as assert } from 'assert'

import uWS from 'uWebSockets.js'
import sendFile from '../index.js'

test('Run server and do a ping request', (t, done) => {
  const port = 3000
  const app = uWS.App()

  app.get('/', (res, req) => sendFile('./test/testfile.txt', res))

  app.listen(port, async (listenSocket) => {
    const req = new Request(`http://localhost:${port}/`)
    const res = await fetch(req)
    const responseText = await res.text()
    assert.strictEqual(res.status, 200)
    assert.strictEqual(responseText, 'hello world')
    console.log('assert ok')
    done()
  })
})