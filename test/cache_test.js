import { test } from 'node:test'
import { strict as assert } from 'assert'

import FileCache from '../index.js'

test('add and get two files from cache', async () => {
	const fileCache = new FileCache()
	await fileCache.init('test/files')
	assert.strictEqual(fileCache.get('test/files/file1.txt').data, 'file1')
	assert.strictEqual(fileCache.get('test/files/file2.txt').data, 'file2')
})
