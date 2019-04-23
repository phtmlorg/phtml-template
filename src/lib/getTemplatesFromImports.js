import importSetterTemplate from './importSetterTemplate';
import { setterMap } from './maps';
import fs from 'fs';
import path from 'path';
import phtml from 'phtml';

/* Get Templates from String
/* ========================================================================== */

async function getTemplatesFromString (from, newSource, result) {
	const newResult = new phtml.Result(newSource, {
		from
	});

	const newVisitors = {
		...result.visitors
	};

	newVisitors.Root.splice(newVisitors.Root.indexOf(result.currentPlugin), 1);

	await newResult.visit(newResult.root, newVisitors);

	const setterHash = setterMap.get(result) || setterMap.set(result, {}).get(result);
	const newSetterHash = setterMap.get(newResult) || setterMap.set(newResult, {}).get(newResult);

	Object.keys(newSetterHash).forEach(name => {
		setterHash[name] = newSetterHash[name];
	});

	process.result = result;
}

/* Get Custom Properties from CSS File
/* ========================================================================== */

async function getTemplatesFromHtmlFile (from, result) {
	const newSource = await readFile(from);

	return getTemplatesFromString(from, newSource, result);
}

/* Get Custom Properties from Object
/* ========================================================================== */

function getTemplatesFromObject (from, object, result) {
	return getTemplatesFromString(from, String(Object(object).html || ''), result);
}

/* Get Custom Properties from JSON file
/* ========================================================================== */

async function getTemplatesFromJsonFile (from, result) {
	const object = await readJSON(from);

	return getTemplatesFromObject(from, object, result);
}

/* Get Custom Properties from JS file
/* ========================================================================== */

async function getTemplatesFromJsFile (from, result) {
	const object = await import(from);

	return getTemplatesFromObject(from, object, result);
}

/* Get Custom Properties from Imports
/* ========================================================================== */

export default function getTemplatesFromImports (sources, result) {
	return sources.map(source => {
		if (source instanceof Promise) {
			return source;
		} else if (source instanceof Function) {
			return source();
		}

		// read the source as an object
		const opts = source === Object(source) ? source : { from: String(source) };

		// skip objects with Custom Properties
		if (opts.html) {
			return opts
		}

		// source pathname
		const from = path.resolve(String(opts.from || ''));

		// type of file being read from
		const type = (opts.type || path.extname(from).slice(1)).toLowerCase() || 'html';

		return { type, from };
	}).reduce(
		async (templates, source) => {
			const { type, from } = await source;

			if (type === 'html') {
				return Object.assign(await templates, await getTemplatesFromHtmlFile(from, result));
			}

			if (type === 'js') {
				return Object.assign(await templates, await getTemplatesFromJsFile(from, result));
			}

			if (type === 'json') {
				return Object.assign(await templates, await getTemplatesFromJsonFile(from, result));
			}

			return Object.assign(await templates, await getTemplatesFromObject(from || '<Object>', source, result));
		},
		{}
	);
}

/* Helper utilities
/* ========================================================================== */

const readFile = from => new Promise((resolve, reject) => {
	fs.readFile(from, 'utf8', (error, result) => {
		if (error) {
			reject(error);
		} else {
			resolve(result);
		}
	});
});

const readJSON = async from => JSON.parse(await readFile(from));
