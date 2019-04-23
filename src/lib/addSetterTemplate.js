import { setterMap } from './maps';

export default function addSetterTemplate (result, name, original, clone) {
	const hash = setterMap.get(result) || setterMap.set(result, {}).get(result);

	hash[name] = { original, clone };

	return name;
}
