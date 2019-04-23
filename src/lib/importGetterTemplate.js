import addGetterTemplate from './addGetterTemplate';
import phtml from 'phtml';

export default function importGetterTemplate (element, result) {
	if (getterRegExp.test(element.name)) {
		// match <as:template name="id"/>
		const name = element.attrs.get(nameRegExp) || '';

		const clone = new phtml.Fragment({
			nodes: element.clone({}, true).nodes
		});

		return addGetterTemplate(result, name, element, clone);
	} else {
		const index = element.attrs.indexOf(getterRegExp);

		if (index !== -1) {
			// match <x as:template="id"/>
			const name = element.attrs[index].value || '';

			const clone = element.clone({}, true);

			clone.attrs.splice(index, 1);

			return addGetterTemplate(result, name, element, clone);
		}
	}

	return null;
}

const nameRegExp = /^name$/;
const getterRegExp = /^as:template$/;
