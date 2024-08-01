/** @format */

import React, { useEffect, useState } from 'react';
import { getBookingData } from '../../utils/apiReq';
import DispatcherBookingTable from './DispatcherBookingTable';

function DispatcherBooking() {
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		async function getTodayBookingData() {
			const response = await getBookingData();
			// console.log(response.bookings)
			const bookings = response.bookings;
			setBookings(bookings);
		}
		getTodayBookingData();
	}, []);

	return (
		<div className='h-[90vh] flex flex-col w-full justify-between items-center'>
			<div className='flex w-full items-center'>
				{/* <div className='bg-gray-300 w-[70%] h-full'>hello</div>
				<div className='bg-gray-400 w-[30%] h-full'>hello</div> */}
			</div>
			<div className='h-[30vh] w-full overflow-auto border-black border-[1px]'>
				<DispatcherBookingTable bookings={bookings} />
			</div>
		</div>
	);
}

export default DispatcherBooking;
