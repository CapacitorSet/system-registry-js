Windows Registry dump
=====================

This is a simple npm module that exports the system registry from Windows XP as a JS object.

## Usage

```
var registry = require("system-registry");
```

## Compiling

Dump the registry to `registry.reg`, convert it from UTF16 to UTF8 (eg. with `iconv`), run `reg2json.js`, prepend `module.exports=` to `registry.json` in order to create `registry.js`. Run a minifier, and copy the output to `src/registry.js`.

```
cd src
# Generate registry.reg.
iconv -f utf-16 -t utf-8 registry.reg -o registry.utf8.reg
node reg2json.js
(echo -n "module.exports="; cat registry.json) > registry.js
uglifyjs --mangle -- registry.js > ../dist/registry.js
```