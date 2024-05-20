import { readdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path'
import mime from 'mime-types';

function FileCache() {
	const fileCache = {}
	let staticFolder = ''

	async function init(folder) {
		staticFolder = folder
		const files = await readdir(staticFolder)
		// read all files in parallel
		const promises = files.map(file => {
			const filePath = path.join(staticFolder, file)
			return readFile(filePath)
		})
		const results = await Promise.all(promises)
		// store the data in the cache with the mime type
		for (let i = 0; i < files.length; i++) {
			const data = results[i]
			const filePath = path.join(staticFolder, files[i])
			const type = mime.lookup(filePath)
			fileCache[filePath] = { data: data.toString(), type: type }
		}
	}

	function get(file) {
		return fileCache[file]
	}

	function send(file, res) {
		console.log('send', file)
		res.onAborted(() => {
			res.aborted = true;
		});
		const fileData = fileCache[file]
		if (!res.aborted) {
			res.cork(() => {
				if (fileData) {
					res.writeStatus('200')
					res.writeHeader('Content-Type', fileData.type)
					res.end(fileData.data.toString())
				} else {
					res.writeStatus('404')
					res.end()
				}
			})
		}
	}

	return {
		init,
		get,
		send
	}
}

export default FileCache
