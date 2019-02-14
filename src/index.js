import phtml, { Element } from 'phtml';

export default new phtml.Plugin('phtml-template', opts => {
	// there are no options as of yet
	const script = Object(opts).script;

	return root => {
		root.walk(node => {
			const isElement = node.type === 'element';

			if (!isElement) {
				return;
			}

			// <x as-template>contents</x> becomes <x><template>contents</template></x>
			// <x as-template="name">contents</x> becomes <x name="name"><template>contents</template></x>
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

			// <x as-slot>value</x> becomes <x><slot>value</slot></x>
			// <x as-slot="name">value</x> becomes <x><slot name="name">value</slot></x>
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

			// <x as-slot-name>value</x> becomes <x><slot slot="name"></slot>z</x>
			// <x as-slot-name="value">after</x> becomes <x><slot slot="name">value</slot>after</x>
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
		});

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
	};
});

const asSlotRegExp = /^as-slot-([_a-zA-Z]+[_a-zA-Z0-9-]*)$/;
