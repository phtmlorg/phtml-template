module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'empty': {
		message: 'supports empty templates'
	},
	'matchless': {
		message: 'supports matchless templates',
		expect: 'matchless.html'
	},
	'readme': {
		message: 'supports readme examples'
	},
	'imports': {
		message: 'supports imports',
		options: {
			importFrom: [
				'./test/readme.html',
				'./test/readme.json',
				{
					html: '<is:template name="replace-3"><div is:slot>Replaceable Content</div></is:template>'
				}
			]
		}
	}
};
