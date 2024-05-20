import fs from 'node:fs'
import path from 'node:path'
import mime from 'mime-types';

function FileCache() {
	const fileCache = {}
	let staticFolder = ''

	function init(folder) {
		staticFolder = folder
		fs.readdir(staticFolder, (err, files) => {
			if (err) {
				console.log(err)
			} else {
				files.forEach(file => {
					const filePath = path.join(staticFolder, file)
					console.log(filePath)
					fs.readFile(filePath, (err, data) => {
						if (err) {
							console.log(err)
						} else {
							const type = mime.lookup(filePath)
							fileCache[filePath] = { data: data, type: type }
						}
					})
				})
			}
		})
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
