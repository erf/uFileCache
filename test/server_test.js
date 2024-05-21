import { test } from 'node:test'
import { strict as assert } from 'assert'

import uWS from 'uWebSockets.js'
import FileCache from '../index.js'

test('fetch file via server', (t, done) => {

  const fileCache = new FileCache()

  fileCache.init('test/files').then(() => {

    const port = 3001
    const app = uWS.App()

    app.get('/file1', (res, req) => fileCache.send('test/files/file1.txt', res))
    app.get('/file2', (res, req) => fileCache.send('test/files/file2.txt', res))

    app.listen(port, async () => {
      const res = await fetch(new Request(`http://localhost:${port}/file2`))
      const responseText = await res.text()
      assert.strictEqual(res.status, 200)
      assert.strictEqual(responseText, 'file2')
      app.close()
      done()
    })
  })
})
