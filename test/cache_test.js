import { test } from 'node:test'
import { strict as assert } from 'assert'

import FileCache from '../index.js'

const fileCache = new FileCache()

test('add and get two files from cache', async () => {
	await fileCache.init('test/files')

	console.log('fileCache.init done')
	assert.strictEqual(fileCache.get('test/files/file1.txt').data, 'file1')
	assert.strictEqual(fileCache.get('test/files/file2.txt').data, 'file2')
	console.log('Test passed')
})
