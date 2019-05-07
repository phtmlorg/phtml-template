# pHTML Template [<img src="https://phtml.io/logo.svg" alt="pHTML" width="90" height="90" align="right">][phtml]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[pHTML Template] lets you create and reuse pre-rendered templates in HTML.

```html
<header is:template="heading">
  <h1 is:slot>Page Heading</h1>
  <hr />
  <is:slot name="subheading"></is:slot>
</header>
```

**Templates** are made with the `<is:template>` element or `is:template`
attribute, and they are used with the `<as:template>` element or `as:template`
atttribute.

```html
<as:template name="heading">
  Goodbye Mars
  <p as:slot="subheading">We really painted the town red...</p>
</as:template>

<!-- becomes -->

<header>
  <h1>Goodbye Mars</h1>
  <hr />
  <p>We really painted the town red...</p>
</header>
```

**Slots** are made with the `<is:slot>` element and `is:slot` attribute, and
their contents are replaced with the `<as:slot>` element or `as:slot` attribute.

When slot content is not replaced, its original content is rendered.

```html
<as:template name="heading"></as:template>

<!-- becomes -->
<header>
  <h1>Main Section</h1>
  <hr />
</header>
```

## Is and As

The `<is:*>` and `<as:*>` elements define “fragment containers” which are not
actually rendered. Nameless content goes into nameless slots.

```html
<is:template name="replace"><is:slot>Replaceable Content</is:slot></is:template>

<as:template name="replace">Replaced Content</as:template>

<!-- becomes -->
Replaced Content
```

The `is:*` and `as:*` attributes render their container, and when both used
together then the “_is_” element always wraps the “_as_” element.

```html
<is:template name="replace"><p is:slot>Replaceable Content</p></is:template>

<as:template name="replace"><span class="inner-span" as:slot>Replaced Content</span></as:template>

<!-- becomes -->
<p><span class="inner-span">Replaced Content</span></p>
```

When the `as:template` attribute is used, its element becomes the wrapper for
nameless slots.

```html
<is:template name="replace"><p is:slot>Replaceable Content</p></is:template>

<span class="inner-span" as:template="replace">Replaced Content</span>

<!-- becomes -->

<p><span class="inner-span">Replaced Content</span></p>
```

## Usage

Transform HTML files directly from the command line:

```bash
npx phtml source.html output.html -p @phtml/template
```

### Node

Add [pHTML Template] to your project:

```bash
npm install @phtml/template --save-dev
```

Use [pHTML Template] to process your HTML:

```js
const phtmlTemplate = require('@phtml/template');

phtmlTemplate.process(YOUR_HTML /*, processOptions, pluginOptions */);
```

Or use it as a [pHTML] plugin:

```js
const phtml = require('phtml');
const phtmlTemplate = require('@phtml/template');

phtml([
  phtmlTemplate(/* pluginOptions */)
]).process(YOUR_HTML /*, processOptions */);
```

[pHTML Template] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [CLI](INSTALL.md#phtml-cli) | [Eleventy](INSTALL.md#eleventy) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- |

## Options

### importFrom

The `importFrom` option specifies objects and sources where Templates can be
imported from.

```js
phtmlTemplate({
  importFrom: 'path/to/file.html'
});
```

These sources might be HTML, JS, and JSON files, functions, and directly
passed objects.

```js
phtmlTemplate({
  importFrom: [
    {
      'phtml-templates': [
        {
          from: 'path/to/file.html'
        },
        {
          html: '<header is:template="heading">\n  <h1 is:slot>Page Heading</h1>\n  <hr />\n  <is:slot name="subheading"></is:slot>\n</header>'
        },
        () => {
          return [
            'path/to/another-file.html',
            {
              html: '<header is:template="another-heading">\n  <h1 is:slot>Page Heading</h1>\n  <hr />\n  <is:slot name="subheading"></is:slot>\n</header>'
            }
          ];
        }
      ]
    }
  ]
});
```

[cli-img]: https://img.shields.io/travis/phtmlorg/phtml-template.svg
[cli-url]: https://travis-ci.org/phtmlorg/phtml-template
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/phtmlorg/phtml
[npm-img]: https://img.shields.io/npm/v/@phtml/template.svg
[npm-url]: https://www.npmjs.com/package/@phtml/template

[pHTML]: https://github.com/phtmlorg/phtml
[pHTML Template]: https://github.com/phtmlorg/phtml-template
