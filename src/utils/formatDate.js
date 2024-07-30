/** @format */

export const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		'0'
	)}-${String(date.getDate()).padStart(2, '0')}T${String(
		date.getHours()
	).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
