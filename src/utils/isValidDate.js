/** @format */
function isValidDate(dateInput) {
	// Try to parse the input into a valid date object
	const date = new Date(dateInput);

	// Check if the date is valid
	if (isNaN(date.getTime())) {
		return false; // Invalid date
	}

	// Define the limit dates
	const startDate = new Date('0000-01-01'); // Start from 1 Jan 0000
	const endDate = new Date('2050-01-01'); // End at 1 Jan 2050

	// Check if the date is within the range
	if (date >= startDate && date <= endDate) {
		return true;
	}

	return false;
}

export { isValidDate };
