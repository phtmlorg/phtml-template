import phtml from 'phtml';

export default function getSlotsFragmentsFromGetterClone (clone) {
	const slots = {};

	const getSlot = id => id in slots
		? slots[id]
	: slots[id] = clone.type === 'element'
		? clone.clone({}, false)
	: new phtml.Fragment();

	clone.nodes.forEach(child => {
		if (child.type !== 'element') {
			getSlot('').append(child.clone({}, true));
		} else if (getterSlotRegExp.test(child.name)) {
			const name = child.attrs && child.attrs.get(nameRegExp) || '';

			getSlot(name).append(...child.clone({}, true).nodes);
		} else {
			const index = child.attrs.indexOf(getterSlotRegExp);

			if (index !== -1) {
				const name = child.attrs[index].value || '';
				const childClone = child.clone({}, true);

				childClone.attrs.splice(index, 1);

				getSlot(name).append(childClone);
			}
		}
	});

	return slots;
}

const nameRegExp = /^name$/;
const getterSlotRegExp = /^as:slot$/;
