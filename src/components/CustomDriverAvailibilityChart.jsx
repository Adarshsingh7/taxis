/** @format */

import { useEffect, useState } from 'react';
import { getDriversAvailablity } from '../utils/apiReq';

const data = [
	{
		userId: 4,
		fullName: 'Paul Barber',
		date: '2024-08-15T00:00:00',
		colorCode: '#86b953ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 5,
		fullName: 'Mark Phillips ',
		date: '2024-08-15T00:00:00',
		colorCode: '#d44a7adc',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '13:00:00',
				to: '15:00:00',
				note: '',
			},
			{
				from: '17:00:00',
				to: '18:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 6,
		fullName: 'Rob Holton',
		date: '2024-08-15T00:00:00',
		colorCode: '#59c4f7ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 7,
		fullName: 'Caroline Stimson',
		date: '2024-08-15T00:00:00',
		colorCode: '#f09286b7',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 1,
		fullName: 'ACE TAXIS',
		date: '2024-08-15T00:00:00',
		colorCode: '#591e77d4',
		vehicleType: 0,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '17:00:00',
				to: '19:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
			{
				from: '10:30:00',
				to: '21:00:00',
				note: 'AM School Run Only',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 9,
		fullName: 'Lee Christopher',
		date: '2024-08-15T00:00:00',
		colorCode: '#fefb67ff',
		vehicleType: 0,
		availableHours: [
			{
				from: '10:30:00',
				to: '24:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 2,
		fullName: 'Kate Hall',
		date: '2024-08-15T00:00:00',
		colorCode: '#c45ff6ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 4,
		fullName: 'Paul Barber',
		date: '2024-08-15T00:00:00',
		colorCode: '#86b953ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 5,
		fullName: 'Mark Phillips ',
		date: '2024-08-15T00:00:00',
		colorCode: '#d44a7adc',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '13:00:00',
				to: '15:00:00',
				note: '',
			},
			{
				from: '17:00:00',
				to: '18:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 6,
		fullName: 'Rob Holton',
		date: '2024-08-15T00:00:00',
		colorCode: '#59c4f7ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 7,
		fullName: 'Caroline Stimson',
		date: '2024-08-15T00:00:00',
		colorCode: '#f09286b7',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 1,
		fullName: 'ACE TAXIS',
		date: '2024-08-15T00:00:00',
		colorCode: '#591e77d4',
		vehicleType: 0,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '17:00:00',
				to: '19:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
			{
				from: '10:30:00',
				to: '21:00:00',
				note: 'AM School Run Only',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 9,
		fullName: 'Lee Christopher',
		date: '2024-08-15T00:00:00',
		colorCode: '#fefb67ff',
		vehicleType: 0,
		availableHours: [
			{
				from: '10:30:00',
				to: '24:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 2,
		fullName: 'Kate Hall',
		date: '2024-08-15T00:00:00',
		colorCode: '#c45ff6ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 4,
		fullName: 'Paul Barber',
		date: '2024-08-15T00:00:00',
		colorCode: '#86b953ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 5,
		fullName: 'Mark Phillips ',
		date: '2024-08-15T00:00:00',
		colorCode: '#d44a7adc',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '13:00:00',
				to: '15:00:00',
				note: '',
			},
			{
				from: '17:00:00',
				to: '18:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 6,
		fullName: 'Rob Holton',
		date: '2024-08-15T00:00:00',
		colorCode: '#59c4f7ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 7,
		fullName: 'Caroline Stimson',
		date: '2024-08-15T00:00:00',
		colorCode: '#f09286b7',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 1,
		fullName: 'ACE TAXIS',
		date: '2024-08-15T00:00:00',
		colorCode: '#591e77d4',
		vehicleType: 0,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '17:00:00',
				to: '19:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
			{
				from: '10:30:00',
				to: '21:00:00',
				note: 'AM School Run Only',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 9,
		fullName: 'Lee Christopher',
		date: '2024-08-15T00:00:00',
		colorCode: '#fefb67ff',
		vehicleType: 0,
		availableHours: [
			{
				from: '10:30:00',
				to: '24:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 2,
		fullName: 'Kate Hall',
		date: '2024-08-15T00:00:00',
		colorCode: '#c45ff6ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		allocatedHours: [],
	},
];
const getPercentage = (time) => {
	const [hours, minutes] = time.split(':').map(Number);
	return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

const WrapperDiv = function () {
	const [data1, setData] = useState([]);

	useEffect(() => {
		async function getData() {
			const response = await getDriversAvailablity(new Date().toISOString());
			const result = Object.values(response);
			result.pop();
			if (response.status === 'success') {
				setData(result);
			}
		}
		getData();
	}, []);

	return (
		<div className='h-[60vh] w-[350px] bg-gray-200'>
			<div className='flex h-full w-full'>
				<div className='flex flex-col h-[58vh] w-10 border-r border-r-black'>
					{Array.from({ length: 24 }, (_, i) => (
						<div
							key={i}
							className='text-xs flex-grow border-t-[1px] border-t-black w-full'
							style={{ height: `${100 / 24}%` }}
						>
							<p>{i}:00</p>
						</div>
					))}
				</div>

				<div className='h-full w-full flex overflow-x-auto overflow-y-hidden ml-0.5'>
					<div className='h-[58vh] flex justify-evenly gap-0.5'>
						{data.map((driver, index) => (
							<TimeBar
								key={index}
								driver={driver}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const TimeBar = ({ driver }) => {
	const availableHours = driver.availableHours;
	const driverName = driver.fullName.split(' ')[0];
	if (!availableHours) return null;

	return (
		<div className='relative h-full w-[30px] border border-gray-100 border-b-black'>
			{/* Hourly Lines */}
			{Array.from({ length: 24 }, (_, i) => (
				<div
					key={i}
					className='absolute left-0 w-full border-t border-gray-100'
					style={{
						top: `${(i / 24) * 100}%`,
						height: '0', // Line thickness
					}}
				/>
			))}

			{/* Time Slots */}
			{availableHours?.map((slot, index) => {
				const fromPercent = getPercentage(slot.from);
				const toPercent = getPercentage(slot.to);
				const heightPercent = toPercent - fromPercent;

				return (
					<div
						key={index}
						title={slot.note}
						style={{
							position: 'absolute',
							top: `${fromPercent}%`,
							height: `${heightPercent}%`,
							width: '100%',
							backgroundColor: driver.colorCode,
						}}
					/>
				);
			})}

			{/* Driver Name */}
			<div className='absolute w-full left-0 bottom-8 transform translate-y-full'>
				<div className='rotate-[-90deg] lowercase text-sm text-gray-400 font-bold'>
					{driverName}
				</div>
			</div>
		</div>
	);
};

export default WrapperDiv;
