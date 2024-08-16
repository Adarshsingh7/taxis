/** @format */

import { useEffect, useState } from 'react';
import { getDriversAvailablity } from '../utils/apiReq';
import { useSelector } from 'react-redux';

const getPercentage = (time) => {
	const [hours, minutes] = time.split(':').map(Number);
	return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

const WrapperDiv = function () {
	const [data, setData] = useState([]);
	const { bookings, activeBookingIndex } = useSelector(
		(state) => state.bookingForm
	);
	const date = bookings[activeBookingIndex].pickupDateTime;
	useEffect(() => {
		async function getData() {
			const response = await getDriversAvailablity(
				new Date(date).toISOString()
			);
			const result = Object.values(response);
			result.pop();
			if (response.status === 'success') {
				setData(result);
			}
		}
		getData();
	}, [date]);

	return (
		<div
			className={`h-full w-[250px] bg-gray-200 mx-auto mt-6 flex justify-center items-center shadow-lg`}
		>
			<div className='flex h-full w-full'>
				<div className='flex flex-col h-[75vh] w-10 border-r border-r-gray-400'>
					{Array.from({ length: 24 }, (_, i) => (
						<div
							key={i}
							className='text-xs flex-grow border-t-[1px] border-t-gray-400 text-gray-600 w-full'
							style={{ height: `${100 / 24}%` }}
						>
							<p>{i}:00</p>
						</div>
					))}
				</div>

				<div className='h-full w-full flex overflow-x-auto overflow-y-hidden ml-0.5'>
					<div className='flex h-[75vh] justify-evenly gap-0.5'>
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
				const toolTip = `${driver.fullName}\n(${slot.from} - ${slot.to})\n${slot.note}`;

				return (
					<div
						key={index}
						title={toolTip}
						style={{
							position: 'absolute',
							top: `${fromPercent}%`,
							height: `${heightPercent}%`,
							width: '100%',
							backgroundColor: driver.colorCode,
						}}
						className='rounded-md'
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
