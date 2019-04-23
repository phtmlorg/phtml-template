import { getterMap, setterMap } from './maps';
import getSlotsFragmentsFromGetterClone from './getSlotsFragmentsFromGetterClone';

export default function transformTemplates (name, result) {
	const getterHash = getterMap.get(result) || getterMap.set(result, {}).get(result);
	const setterHash = setterMap.get(result) || setterMap.set(result, {}).get(result);

	if (name in getterHash && name in setterHash) {
		const getterTemplate = getterHash[name];
		const setterTemplate = setterHash[name];

		const slots = getSlotsFragmentsFromGetterClone(getterTemplate.clone);
		const setterClone = setterTemplate.clone.clone({}, true);

		return setterClone.visit(result, {
			Element (element) {
				if (setterSlotRegExp.test(element.name)) {
					const name = element.attrs.get(nameRegExp) || '';

					if (name in slots) {
						element.replaceWith(slots[name].clone({}, true));
					} else {
						element.replaceWith(...element.nodes);
					}
				} else {
					const index = element.attrs.indexOf(setterSlotRegExp);

					if (index !== -1) {
						const name = element.attrs[index].value || '';

						element.attrs.splice(index, 1);

						if (name in slots) {
							element.replaceAll(slots[name].clone({}, true));
						}
					}
				}
			}
		}).then(
			() => {
				setterTemplate.original.remove();

				if (setterClone) {
					getterTemplate.original.replaceWith(setterClone);
				}
			}
		);
	}

	return Promise.resolve();
}

const nameRegExp = /^name$/;
const setterSlotRegExp = /^is:slot$/;
