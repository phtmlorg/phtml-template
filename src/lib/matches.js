export function isElementAsSlot (element) {
	return element.attrs && asSlotRegExp.test(element.name) && element.attrs.contains('name');
}

export function isElementAsSlotAttributed (element) {
	return element.attrs && element.attrs.some(containsAttribute(asSlotRegExp));
}

export function isElementAsTemplate (element) {
	return element.attrs && asTemplateRegExp.test(element.name) && element.attrs.contains('name');
}

export function isElementAsTemplateAttributed (element) {
	return element.attrs && element.attrs.some(containsAttribute(asTemplateRegExp));
}

export function isElementIsSlot (element) {
	return element.attrs && isSlotRegExp.test(element.name) && element.attrs.contains('name');
}

export function isElementIsSlotAttributed (element) {
	return element.attrs && element.attrs.some(containsAttribute(isSlotRegExp));
}

export function isElementIsTemplate (element) {
	return element.attrs && isTemplateRegExp.test(element.name) && element.attrs.contains('name');
}

export function isElementIsTemplateAttributed (element) {
	return element.attrs && element.attrs.some(containsAttribute(isTemplateRegExp));
}

function containsAttribute (regexp) {
	return attr => regexp.test(attr.name);
}

export const asSlotString = 'as:slot';
export const asTemplateString = 'as:template';
export const isSlotString = 'is:slot';
export const isTemplateString = 'is:template';
export const asSlotRegExp = /^as:slot$/;
export const asTemplateRegExp = /^as:template$/;
export const isSlotRegExp = /^is:slot$/;
export const isTemplateRegExp = /^is:template$/;
