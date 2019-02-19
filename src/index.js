import phtml, { Element } from 'phtml';

export default new phtml.Plugin('phtml-template', opts => {
	// there are no options as of yet
	const script = Object(opts).script;

	return {
		Element(node) {
			// <custom-x as-template>contents</custom-x> becomes <custom-x><template>contents</template></custom-x>
			// <custom-x as-template="name">contents</custom-x> becomes <custom-x name="name"><template>contents</template></custom-x>
			const templateName = node.attrs.get('as-template');

			// inner-wrap a template
			if (templateName !== false) {
				const template = new Element({
					name: 'template',
					nodes: node.nodes
				});

				if (templateName && !node.attrs.contains('name')) {
					node.attrs.add('name', templateName);
				}

				node.prepend(template);

				node.attrs.remove('as-template');
			}

			// <custom-x as-slot>value</custom-x> becomes <custom-x><slot>value</slot></custom-x>
			// <custom-x as-slot="name">value</custom-x> becomes <custom-x><slot name="name">value</slot></custom-x>
			const slotName = node.attrs.get('as-slot');

			// inner-wrap a slot
			if (slotName !== false) {
				const slot = new Element({
					name: 'slot',
					attrs: slotName ? { name: slotName } : {},
					nodes: node.nodes
				});

				node.prepend(slot);

				node.attrs.remove('as-slot');
			}

			// <custom-x as-slot-name>value</custom-x> becomes <custom-x><slot slot="name"></slot>z</custom-x>
			// <custom-x as-slot-name="value">after</custom-x> becomes <custom-x><slot slot="name">value</slot>after</custom-x>
			const slots = [];

			// prepend slots
			node.attrs.forEach(attr => {
				const match = attr.name.match(asSlotRegExp);

				if (match) {
					const [, name] = match;
					const slot = new Element({
						name: 'slot',
						attrs: { slot: name },
						nodes: attr.value ? [ attr.value ] : []
					});

					slots.push(slot);

					node.attrs.remove(attr.name);
				}
			});

			if (slots.length) {
				node.prepend(...slots);
			}
		},
		Root(root) {
			// add the script, preferably to the end of <head>
			if (script) {
				const asScriptName = typeof script === 'string' ? script : 'custom-element';

				const script1 = new Element({
					name: 'script',
					attrs: { src: 'https://unpkg.com/@phtml/template/browser' }
				});
				const script2 = new Element({
					name: 'script',
					nodes: [
						`!function d(){/c/.test(document.readyState)&&document.body?document.removeEventListener("readystatechange",d)|asTemplate("${asScriptName}"):document.addEventListener("readystatechange",d)}()`
					]
				});

				const html = root.nodes.find(child => child.type === 'element' && child.name === 'html') || root;
				const head = html.nodes.find(child => child.type === 'element' && child.name === 'head') || html;

				head.append(script1, script2);
			}
		}
	};
});

const asSlotRegExp = /^as-slot-([_a-zA-Z]+[_a-zA-Z0-9-]*)$/;
