import addSetterTemplate from './addSetterTemplate';
import phtml from 'phtml';

export default function importSetterTemplate (element, result) {
	if (setterRegExp.test(element.name)) {
		// match <is:template name="id"/>
		const name = element.attrs.get(nameRegExp) || '';

		const clone = new phtml.Fragment({
			nodes: element.clone({}, true).nodes
		});

		return addSetterTemplate(result, name, element, clone);
	} else {
		const index = element.attrs.indexOf(setterRegExp);

		if (index !== -1) {
			// match <x is:template="id"/>
			const name = element.attrs[index].value || '';

			const clone = element.clone({}, true);

			clone.attrs.splice(index, 1);

			return addSetterTemplate(result, name, element, clone);
		}
	}

	return null;
}

const nameRegExp = /^name$/;
const setterRegExp = /^is:template$/;
