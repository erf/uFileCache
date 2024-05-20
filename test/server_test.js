import { test } from 'node:test'
import { strict as assert } from 'assert'

import uWS from 'uWebSockets.js'
import FileCache from '../index.js'

const fileCache = new FileCache()


test('fetch file via server', async () => {

  await fileCache.init('test/files')

  const port = 3000
  const app = uWS.App()

  app.get('/file1', (res, req) => fileCache.send('test/files/file1.txt', res))
  app.get('/file2', (res, req) => fileCache.send('test/files/file2.txt', res))

  app.listen(port, async () => {
    const req = new Request(`http://localhost:${port}/file2`)
    const res = await fetch(req)
    const responseText = await res.text()
    assert.strictEqual(res.status, 200)
    assert.strictEqual(responseText, 'file2')
    console.log('assert ok')
  })
})
