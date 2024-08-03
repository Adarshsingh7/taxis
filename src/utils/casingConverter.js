/** @format */

function convertKeysToFirstUpper(obj) {
	if (typeof obj !== 'object' || obj === null) return obj; // Return if not an object

	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToFirstUpper(item)); // Recursively process arrays
	}

	return Object.keys(obj).reduce((acc, key) => {
		// Convert the first character of the key to uppercase
		const newKey = key.charAt(0).toUpperCase() + key.slice(1);
		acc[newKey] = convertKeysToFirstUpper(obj[key]); // Recursively process nested objects
		return acc;
	}, {});
}

function toCamelCase(str) {
	return str
		.replace(/[_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^[A-Z]/, (match) => match.toLowerCase());
}

function convertKeysToCamelCase(obj) {
	if (typeof obj !== 'object' || obj === null) return obj; // Return if not an object

	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToCamelCase(item)); // Recursively process arrays
	}

	return Object.keys(obj).reduce((acc, key) => {
		const newKey = toCamelCase(key);
		acc[newKey] = convertKeysToCamelCase(obj[key]); // Recursively process nested objects
		return acc;
	}, {});
}

export { convertKeysToFirstUpper, convertKeysToCamelCase };
