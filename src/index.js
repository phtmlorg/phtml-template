import phtml from 'phtml';
import transformTemplates from './lib/transformTemplates';
import importGetterTemplate from './lib/importGetterTemplate';
import importSetterTemplate from './lib/importSetterTemplate';

export default new phtml.Plugin('@phtml/template', () => {
	return {
		afterElement (element, result) {
			const getterName = importGetterTemplate(element, result);

			if (getterName) {
				return transformTemplates(getterName, result);
			} else {
				const setterName = importSetterTemplate(element, result);

				if (setterName) {
					return transformTemplates(setterName, result);
				}
			}
		}
	};
});
