import phtml from 'phtml';
import getTemplatesFromImports from './lib/getTemplatesFromImports';
import transformTemplates from './lib/transformTemplates';
import importGetterTemplate from './lib/importGetterTemplate';
import importSetterTemplate from './lib/importSetterTemplate';

export default new phtml.Plugin('@phtml/template', opts => {
	// sources to import templates from
	const importFrom = [].concat(Object(opts).importFrom || []);

	return {
		Root (element, result) {
			return getTemplatesFromImports(importFrom, result);
		},
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
