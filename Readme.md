# extract-di-webpack-plugin [![Build Status](https://travis-ci.org/jakwuh/extract-di-webpack-plugin.svg?branch=master)](https://travis-ci.org/jakwuh/extract-di-webpack-plugin)

## Usage:

### Step 1

Add plugin to webpack config:
```js
// webpack.config.js
const ExtractDIPlugin = require('extract-di-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        // ...
        new ExtractDIPlugin()
    ]
    
 }

```

ExtractDIPlugin accepts 2 arguments:

```js
/**
 * @param {string} [moduleName = 'di-definitions] - used for requiring definitions in your code
 * @param {{}} options
 * @param {string} [options.exportName = '__diDefinitions'] - used for parsing definitions from your modules
 */
```

### Step 2

In your modules use following syntax to export definitions:

```js
// module.js
Object.defineProperty(exports, '__diDefinitions', {
    currentUser: ['User', {
        request: 'Requst'
    }]
});
```

Exported definitions from all modules will be merged into one object and available for requiring from any place of a code.

Note, it is not necessary to write such definitions manually. Consider using [babel-plugin-extract-dependency-definitions](https://github.com/jakwuh/babel-plugin-extract-dependency-definitions) to export definitions automatically.

### Step 3

Now you can require parsed definitions anywhere you want. 

```js
// entry.js
const definitions = require('di-definitons');
```
