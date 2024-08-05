/** @format */

export default function isLightColor(hex) {
	// Remove the leading # if present
	hex = hex.replace(/^#/, '');

	// Parse the hex color
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	// Calculate the relative luminance
	let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

	// Determine if the color is light
	return luminance > 0.5;
}
