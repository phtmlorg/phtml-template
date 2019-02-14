export default function define(name) {
	customElements.define(name, class extends HTMLElement {
		connectedCallback() {
			const template = this.querySelector('template');

			if (template) {
				customElements.define(this.getAttribute('name'), class extends HTMLElement {
					constructor() {
						super();

						this.attachShadow({ mode: 'open' });
					}

					connectedCallback() {
						if (!this.shadowRoot.firstChild) {
							this.shadowRoot.appendChild(document.importNode(template.content, true));
						}
					}
				});
			}
		}
	});
}
