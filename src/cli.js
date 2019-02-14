import fs from 'fs';
import plugin from '.';

const argo = getArgo();
const pluginOptions = getPluginOpts();

(argo.from === '<stdin>' ? getStdin() : readFile(argo.from))
.then(html => {
	if (argo.from === '<stdin>' && !html) {
		logInstructions();

		process.exit(0);
	}

	const processOptions = Object.assign({ from: argo.from, to: argo.to || argo.from }, argo.map ? { map: JSON.parse(argo.map) } : {});

	return plugin.process(html, processOptions, pluginOptions).then(result => {
		if (argo.to === '<stdout>') {
			return result.html;
		} else {
			return writeFile(argo.to, result.html).then(
				() => `HTML has been written to "${argo.to}"`
			)
		}
	});
}).catch(
	error => {
		if (Object(error).errno === -2) {
			throw new Error(`Sorry, "${error.path}" could not be read.`);
		}

		throw error;
	}
).then(
	result => {
		console.log(result);

		process.exit(0);
	},
	error => {
		console.error(Object(error).message || 'Something bad happened and we don’t even know what it was.');

		process.exit(1);
	}
);

function getArgo () {
	return process.argv.slice(2).reduce(
		(object, arg, i, args) => { // eslint-disable-line max-params
			const dash = /^--([^\s]+)$/;

			if (dash.test(arg)) {
				object[arg.replace(dash, '$1')] = i + 1 in args ? args[i + 1] : true;
			} else if (!dash.test(args[i - 1])) {
				if (object.from === '<stdin>') {
					object.from = arg;
				} else if (object.to === '<stdout>') {
					object.to = arg;
				}
			}

			return object;
		},
		{ from: '<stdin>', to: '<stdout>', opts: 'null' }
	);
}

function getStdin () {
	return new Promise(resolve => {
		let data = '';

		if (process.stdin.isTTY) {
			resolve(data);
		} else {
			process.stdin.setEncoding('utf8');

			process.stdin.on('readable', () => {
				let chunk;

				while (chunk = process.stdin.read()) {
					data += chunk;
				}
			});

			process.stdin.on('end', () => {
				resolve(data);
			});
		}
	});
}

function getPluginOpts () {
	return Object.assign({
		script: argo.script ? getJSON(argo.script) : true
	}, getJSON(argo.opts));
}

function getJSON (value) {
	const relaxedJsonPropRegExp = /(['"])?([a-z0-9A-Z_]+)(['"])?:/g;
	const relaxedJsonValueRegExp = /("[a-z0-9A-Z_]+":\s*)(?!true|false|null|\d+)'?([A-z0-9]+)'?([,}])/g;

	return JSON.parse(
		value
		.replace(relaxedJsonPropRegExp, '"$2": ')
		.replace(relaxedJsonValueRegExp, '$1"$2"$3')
	);
}

function readFile (pathname) {
	return new Promise((resolve, reject) => {
		fs.readFile(pathname, 'utf8', (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
}

function writeFile (pathname, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(pathname, data, (error, content) => {
			if (error) {
				reject(error);
			} else {
				resolve(content);
			}
		});
	});
}

function logInstructions () {
	console.log([
		'pHTML Template\n',
		'  Create templates and slots more quickly in HTML\n',
		'Usage:\n',
		'  phtml-template SOURCE.html TRANSFORMED.html',
		'  phtml-template --from=SOURCE.html --to=TRANSFORMED.html --script=custom-element',
		'  echo "<custom-element as-template></custom-element>" | phtml-template\n'
	].join('\n'));
}
