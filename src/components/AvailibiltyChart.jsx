/** @format */

import { BarChart } from '@mui/x-charts/BarChart';

export default function AvailabilityChart() {
	return (
		<BarChart
			disableAxisListener={true}
			highlightedItem={null}
			series={[
				{ data: [3], stack: 'A', label: 'Driver a' },
				{ data: [4], stack: 'B', label: 'allocated b', color: 'green' },
				{ data: [4], stack: 'C', label: 'Driver c' },
				{ data: [2], stack: 'D', label: 'Driver d' },
				{ data: [4], stack: 'B', label: 'unallocated b', color: 'white' },
				{ data: [2], stack: 'B', label: 'allocated b', color: 'green' },
				{ data: [4], stack: 'C', label: 'Driver h' },
				{ data: [2], stack: 'D', label: 'Driver i' },
			]}
			width={300}
			height={650}
		/>
	);
}
