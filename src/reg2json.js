// Instructions: use regedit.exe to dump the registry to a .reg file, then use iconv to convert it to utf8, and save it to registry.utf8.reg

// From deepSet on npm
// Changes:
//   removed `create` (hardcoded to true)
//   `path` is a string to be split by "\\" (one backslash)
//   parse hex(1), hex(2)
function deepSet (obj, path, value) {
	if (/^hex\([12]\):/.test(value)) {
		value = value.replace(/^hex\([12]\):/, "");
		const valueBytes = value.split(",").map(byte => parseInt(byte, 16));
		// https://stackoverflow.com/a/40420168
		value = Buffer.from(valueBytes).toString("utf16le");
	}
	if (/hex\(2\)/.test(value)) throw value;
	var properties = path.split("\\")
	var currentObject = obj
	var property

	while (properties.length) {
		property = properties.shift()
		
		if (!currentObject) break;
		
		if (!isObject(currentObject[property])) {
			currentObject[property] = {}
		}

		if (!properties.length){
			currentObject[property] = value
		}
		currentObject = currentObject[property]
	}

	return obj
}

function isObject(obj) {
	return typeof obj === 'object' && obj !== null
}

console.log("Loading...");
const ini = require("ini");
const fs = require("fs");
const registry = fs.readFileSync("registry.utf8.reg", "utf8").replace(/\\\r\n  /g, "");

console.log("Decoding...");
const obj = ini.decode(registry);

console.log("Writing to memory...");
let json = {};

Object.keys(obj).forEach(key => {
	const val = obj[key];
	if (val["@"])
		deepSet(json, key, val["@"]);
	Object.keys(val).forEach(subkey => {
		const subval = val[subkey];
		const actualKey = key + "\\" + subkey;
		deepSet(json, actualKey, subval);
	});
});

console.log("Writing to disk...");
fs.writeFileSync("registry.json", JSON.stringify(json));

console.log("Done.");