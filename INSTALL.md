# Installing pHTML Template

[pHTML Template] runs in all Node environments, with special instructions for:

| [Node](#node) | [CLI](#phtml-cli) | [Eleventy](#eleventy) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- |

## Node

Add [pHTML Template] to your project:

```bash
npm install @phtmlorg/template --save-dev
```

Use [pHTML Template] to process your HTML:

```js
const phtmlTemplate = require('@phtmlorg/template')

phtmlTemplate.process(YOUR_HTML /*, processOptions, pluginOptions */)
```

Or use it as a [pHTML] plugin:

```js
const phtml = require('phtml')
const phtmlTemplate = require('@phtmlorg/template')

phtml([
  phtmlTemplate(/* pluginOptions */)
]).process(YOUR_HTML /*, processOptions */)
```

## CLI

Transform HTML files directly from the command line:

```bash
npx phtml source.html output.html -p @phtmlorg/template
```

Alternatively, add [pHTML Template] to your `phtml.config.js` configuration file:

```js
module.exports = {
  plugins: [
    ['@phtmlorg/template', /* pluginOptions */]
  ]
}
```

## Eleventy

Add [pHTML Eleventy] and [pHTML Template] to your Eleventy project:

```sh
npm install @phtmlorg/template @phtml/11ty --save-dev
```

Use [pHTML Eleventy] and [pHTML Template] in your Eleventy configuration:

```js
const phtml11ty = require('@phtml/11ty')
const phtmlTemplate = require('@phtmlorg/template')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(phtml11ty, {
    use: [
      phtmlTemplate(/* pluginOptions */)
    ]
  })
}
```

## Gulp

Add [Gulp pHTML] and [pHTML Template] to your project:

```bash
npm install @phtmlorg/template gulp-phtml --save-dev
```

Use [Gulp pHTML] and [pHTML Template] in your Gulpfile:

```js
const gulp = require('gulp')
const gulpPhtml = require('gulp-phtml')
const phtmlTemplate = require('@phtmlorg/template')

gulp.task('html',
  () => gulp.src('./src/*.html').pipe(
    gulpPhtml({
      plugins: [
        phtmlTemplate(/* pluginOptions */)
      ]
    })
  ).pipe(
    gulp.dest('dist')
  )
)
```

## Grunt

Add [Grunt pHTML] to your project:

```bash
npm install grunt-phtml --save-dev
```

Use [Grunt pHTML] and [pHTML Template] in your Gruntfile:

```js
const phtmlTemplate = require('@phtmlorg/template')

grunt.loadNpmTasks('grunt-phtml')

grunt.initConfig({
  phtml: {
    options: {
      plugins: [
        phtmlTemplate(/* pluginOptions */)
      ]
    },
    dist: {
      files: [{
        expand: true,
        src: 'src/*.html',
        dest: 'dest'
      }]
    }
  }
})
```

[Gulp pHTML]: https://github.com/phtmlorg/gulp-phtml
[Grunt pHTML]: https://github.com/phtmlorg/grunt-phtml
[pHTML]: https://github.com/phtmlorg/phtml
[pHTML Eleventy]: https://github.com/phtmlorg/phtml-11ty
[pHTML Template]: https://github.com/phtmlorg/phtml-template
