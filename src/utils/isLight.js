/** @format */

export default function isLightColor(hex) {
	// Remove the leading # if present
	hex = hex.replace(/^#/, '');

	// Parse the hex color
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	// Calculate the brightness using the luminance formula
	let brightness = r * 0.299 + g * 0.587 + b * 0.114;

	// Determine if the color is light
	return brightness > 186;
}

export function rgbaToHex(rgba) {
	// Extract the rgba or rgb values using regex
	const rgbaMatch = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)$/);

	// If it's not a valid rgba or rgb string, return an empty string
	if (!rgbaMatch) return '';

	let r = parseInt(rgbaMatch[1]);
	let g = parseInt(rgbaMatch[2]);
	let b = parseInt(rgbaMatch[3]);
	let a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1; // default alpha to 1 if not provided

	// Convert each color component to its hex value
	const toHex = (value) => {
		let hex = value.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	// Convert RGB to Hex
	const hexR = toHex(r);
	const hexG = toHex(g);
	const hexB = toHex(b);

	// If alpha is less than 1, include it in the hex value
	if (a < 1) {
		const hexA = toHex(Math.round(a * 255));
		return `#${hexR}${hexG}${hexB}${hexA}`;
	}

	return `#${hexR}${hexG}${hexB}`;
}
