/** @format */

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';

function Footer() {
	const user = useAuth();
	console.log('User', user);
	const { isActiveTestMode } = useSelector((state) => state.bookingForm);

	const [time, setTime] = useState(new Date().toLocaleTimeString());
	const [date, setDate] = useState(new Date().toDateString());
	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date();
			setTime(now.toLocaleTimeString());
			setDate(now.toDateString());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className=' flex justify-center items-center h-8 w-full fixed bottom-0 bg-[#424242] text-gray-200'>
			<div className='flex justify-between items-center w-[98%]'>
				<div className='flex justify-center items-center gap-2'>
					<span>{user.currentUser?.fullName}</span>
					<span>({user.currentUser?.phoneNumber})</span>
				</div>

				<div className='flex justify-center items-center text-gray-200 gap-2'>
					<div className='border border-gray-500 px-1'>F1-Availability</div>
					<div className='border border-gray-500 px-1'>F2-Map</div>
					<div className='border border-gray-500 px-1'>F3-Scheduler</div>
					<div className='border border-gray-500 px-1'>F4-Messages</div>
					<div
						className={` ${
							isActiveTestMode ? 'text-[#C74949]' : 'text-green-600'
						} 'border border-gray-500 px-1'`}
					>
						Mode: {isActiveTestMode ? 'Test' : 'Live'}
					</div>
					<div className='flex flex-col gap-0 justify-center items-end'>
						<div className='text-[12px]'>{time}</div>
						<div className='mt-[-3px] text-[12px]'>{date}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Footer;
