import { getterMap } from './maps';

export default function addGetterTemplate (result, name, original, clone) {
	const hash = getterMap.get(result) || getterMap.set(result, {}).get(result);

	hash[name] = { original, clone };

	return name;
}
