/** @format */

// import { BarChart } from '@mui/x-charts/BarChart';

// export default function AvailabilityChart() {
// 	return (
// 		<BarChart
// 			disableAxisListener={true}
// 			highlightedItem={null}
// 			series={[
// 				{ data: [3], stack: 'A', label: 'Driver a' },
// 				{ data: [4], stack: 'B', label: 'allocated b', color: 'green' },
// 				{ data: [4], stack: 'C', label: 'Driver c' },
// 				{ data: [2], stack: 'D', label: 'Driver d' },
// 				{ data: [4], stack: 'B', label: 'unallocated b', color: 'white' },
// 				{ data: [2], stack: 'B', label: 'allocated b', color: 'green' },
// 				{ data: [4], stack: 'C', label: 'Driver h' },
// 				{ data: [2], stack: 'D', label: 'Driver i' },
// 			]}
// 			width={300}
// 			height={650}
// 		/>
// 	);
// }

import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function DriverAvailabilityChart() {
	// Sample data for driver availability
	const drivers = [
		{
			name: 'Alice',
			availability: [
				{ start: 0, end: 12 },
				{ start: 14, end: 22 },
			],
		},
		{
			name: 'Bob',
			availability: [
				{ start: 6, end: 10 },
				{ start: 12, end: 18 },
			],
		},
		{
			name: 'Charlie',
			availability: [
				{ start: 8, end: 14 },
				{ start: 16, end: 20 },
			],
		},
		{
			name: 'David',
			availability: [
				{ start: 5, end: 13 },
				{ start: 15, end: 19 },
			],
		},

		{
			name: 'Eve',
			availability: [
				{ start: 7, end: 11 },
				{ start: 13, end: 17 },
			],
		},
	];

	// Prepare dataset for each driver
	const datasets = drivers.map((driver) => {
		const dataSegments = [];
		let lastEnd = 0;

		driver.availability.forEach((segment) => {
			// Add unavailability before the current availability segment
			if (segment.start > lastEnd) {
				dataSegments.push({
					label: 'Unavailable',
					value: segment.start - lastEnd,
					color: 'rgba(255, 255, 255, 0.5)', // Red for unavailable
					start: lastEnd,
					end: segment.start,
				});
			}

			// Add the current availability segment
			dataSegments.push({
				label: 'Available',
				value: segment.end - segment.start,
				color: 'rgba(75, 192, 192, 0.5)', // Green for available
				start: segment.start,
				end: segment.end,
			});

			lastEnd = segment.end;
		});

		// Add unavailability after the last availability segment
		if (lastEnd < 24) {
			dataSegments.push({
				label: 'Unavailable',
				value: 24 - lastEnd,
				color: 'rgba(255, 255, 255, 0.5)', // Red for unavailable
				start: lastEnd,
				end: 24,
			});
		}

		return {
			driverName: driver.name,
			dataSegments,
		};
	});

	// Flatten datasets for stacked bars
	const flattenedData = drivers.map((driver) => ({
		label: driver.name,
		data: datasets
			.find((d) => d.driverName === driver.name)
			.dataSegments.map((seg) => seg.value),
		backgroundColor: datasets
			.find((d) => d.driverName === driver.name)
			.dataSegments.map((seg) => seg.color),
	}));

	// Generate chart data
	const data = {
		labels: drivers.map((driver) => driver.name),
		datasets: flattenedData.map((segment) => ({
			label: segment.label,
			data: segment.data,
			backgroundColor: segment.backgroundColor,
		})),
	};

	// Configure chart options with custom tooltip
	const options = {
		indexAxis: 'y',
		scales: {
			x: {
				stacked: true,
				beginAtZero: true,
				max: 24,
				title: {
					display: true,
					text: 'Time (Hours)',
				},
				ticks: {
					stepSize: 1,
					callback: function (value) {
						// Format the tick labels as HH:00
						const hours = value < 10 ? `0${value}` : value;
						return `${hours}:00`;
					},
					autoSkip: false,
					maxRotation: 90,
					minRotation: 90,
					align: 'center',
				},
			},
			y: {
				stacked: true,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				display: false, // This hides the legend
			},
			// title: {
			// 	display: true,
			// 	text: 'Driver Availability Timeline',
			// },
			tooltip: {
				callbacks: {
					label: function (context) {
						// Get the dataset index and data index
						const driverIndex = context.datasetIndex;
						const segmentIndex = context.dataIndex;
						const driverSegments = datasets[driverIndex].dataSegments;

						// Find the specific segment for this tooltip
						const segment = driverSegments[segmentIndex];

						// Construct the time frame
						// const timeFrame = `${segment.start}:00 to ${segment.end}:00`;

						// Return the label for the tooltip
						return `${segment.label}`;
					},
				},
			},
		},
	};

	return (
		<div className='w-[600px] h-[400px] mt-48'>
			<h2 className='text-white'>Driver Availability Chart</h2>
			<Bar
				data={data}
				options={options}
				className='mt-48'
			/>
		</div>
	);
}
