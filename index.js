import { readdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import isBinaryPath from 'is-binary-path';
import path from 'node:path'
import mime from 'mime-types';

function FileCache() {
	const fileCache = {}
	let staticFolder = ''

	async function init(folder) {
		staticFolder = folder
		let files
		try {
			files = await readdir(staticFolder)
		} catch (err) {
			console.error('Error reading static folder:', err)
			return
		}
		const pathList = files.map(file => path.join(staticFolder, file))
		const mimeTypeList = files.map(file => mime.lookup(file))
		// read all files in parallel
		const promises = pathList.map(filePath => {
			const encoding = isBinaryPath(filePath) ? 'binary' : 'utf8'
			return readFile(filePath, encoding)
		})
		let fileContentList
		try {
			fileContentList = await Promise.all(promises)
		} catch (err) {
			console.error('Error reading files:', err)
			return
		}
		// store the data in the cache with the mime type
		for (let i = 0; i < files.length; i++) {
			const filePath = pathList[i]
			const data = fileContentList[i]
			const type = mimeTypeList[i]
			fileCache[filePath] = { data: data, type: type }
		}
	}

	function get(file) {
		return fileCache[file]
	}

	function send(file, res) {
		console.log('send ->', file)
		res.onAborted(() => {
			res.aborted = true;
		});
		const fileData = fileCache[file]
		if (!res.aborted) {
			res.cork(() => {
				if (fileData) {
					res.writeStatus('200')
					res.writeHeader('Content-Type', fileData.type)
					res.end(fileData.data)
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
