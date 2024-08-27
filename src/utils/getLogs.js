/** @format */

export const fetchLogs = () => {
	return JSON.parse(localStorage.getItem('app_logs')) || [];
};
