# uFileCache

A minimal static file cache handler for [uWebSocket.js](https://github.com/uNetworking/uWebSockets.js)

> NOTE: Only for small files.

## Installation

Add the following to your `package.json` file:

```json
{
  "dependencies": {
	"uFileCache": "github:erf/uFileCache"
  }
}
```

Then run `npm install`.

## Usage

```javascript

// import the modules 
import uWS from 'uWebSockets.js'
import FileCache from 'uFileCache'

const fileCache = new FileCache()

// load files in folder to memory
fileCache.init('public')

// create a new app
const app = uWS.App()

// index.html
app.get('/', (res, req) => fileCache.send('./public/index.html', res))

// static files
app.get('/*', (res, req) => fileCache.send(`./public${req.getUrl()}`, res))
```

## Test

```
node --test --no-warnings=ExperimentalWarning
```
