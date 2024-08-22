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
