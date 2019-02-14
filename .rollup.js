import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isBrowser = String(process.env.NODE_ENV).includes('browser');
const isBrowserDev = String(process.env.NODE_ENV).includes('browserdev');
const isCli = String(process.env.NODE_ENV).includes('cli');

const pathname = isBrowser ? 'browser' : isCli ? 'cli' : 'index';
const input = `src/${pathname}.js`;
const output = isBrowserDev
	? { file: 'browser.development.js', format: 'cjs', sourcemap: true }
: isBrowser
	? { file: 'browser.js', format: 'cjs' }
: isCli
	? { file: 'cli.js', format: 'cjs' }
: [
	{ file: 'index.js', format: 'cjs', sourcemap: true },
	{ file: 'index.mjs', format: 'esm', sourcemap: true }
];
const targets = isBrowser ? 'last 2 chrome versions, last 2 edge versions, last 2 firefox versions, last 2 safari versions, last 2 ios versions' : { node: 6 };
const plugins = [
	babel({
		presets: [
			['@babel/env', {
				loose: true,
				modules: false,
				targets,
				useBuiltIns: 'entry'
			}]
		]
	})
].concat(
	isBrowser ? modernUMD('asTemplate', 'define') : [],
	isBrowserDev ? [] : terser(),
	isCli ? addHashBang() : []
);

export default { input, output, plugins };

function modernUMD(name, exportName) {
	const replacee = `module.exports = ${exportName}`;
	const replacer = `"object"==typeof self?self.${name}=${exportName}:"object"==typeof module&&module.exports&&(module.exports=${exportName})`;

	return {
		name: 'modern-umd',
		renderChunk(code) {
			return `!function(){${
				code
				.replace(/'use strict';\n*/, '')
				.replace(replacee, replacer)
			}}()`;
		}
	};
}

function addHashBang() {
	return {
		name: 'add-hash-bang',
		renderChunk(code) {
			const updatedCode = `#!/usr/bin/env node\n\n${code}`;

			return updatedCode;
		}
	};
}
