/** @format */

import { useState } from 'react';
import 'tailwindcss/tailwind.css';

const BookingTable = ({ bookings, onConfirm, onSet }) => {
	const [activeTab, setActiveTab] = useState('current-bookings');
	const [selectedRow, setSelectedRow] = useState(null);
	const isEmpty =
		bookings.Current.length === 0 && bookings.Previous.length === 0;

	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setSelectedRow(null); // Reset selected row when switching tabs
	};

	const selectRow = (index) => {
		setSelectedRow(index);
	};

	const confirmSelection = () => {
		if (selectedRow !== null) {
			const selectedBooking =
				activeTab === 'current-bookings'
					? bookings.Current[selectedRow]
					: bookings.Previous[selectedRow];

			onConfirm(selectedBooking);
		} else {
			alert('No row selected');
		}
	};

	function handleCreateNewBookingWithTelephone() {
		onConfirm({ PhoneNumber: bookings.Telephone });
	}

	return (
		<div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-5'>
			<h2 className='text-xl font-semibold mb-4'>📞 ({bookings.Telephone})</h2>
			<div className='flex border-b mb-4'>
				<button
					className={`tab-link py-2 px-4 text-gray-600 border-b-2 ${
						activeTab === 'current-bookings'
							? 'border-blue-500'
							: 'border-transparent'
					} hover:border-blue-500 focus:outline-none`}
					onClick={() => handleTabClick('current-bookings')}
				>
					Current Bookings
				</button>
				<button
					className={`tab-link py-2 px-4 text-gray-600 border-b-2 ${
						activeTab === 'previous-bookings'
							? 'border-blue-500'
							: 'border-transparent'
					} hover:border-blue-500 focus:outline-none`}
					onClick={() => handleTabClick('previous-bookings')}
				>
					Previous Bookings
				</button>
			</div>
			<div
				className={`${
					activeTab === 'current-bookings' ? 'block' : 'hidden'
				}  h-[40vh] overflow-auto`}
			>
				<CurrentTable
					bookings={bookings.Current}
					selectRow={selectRow}
					selectedRow={selectedRow}
				/>
			</div>
			<div
				className={`${
					activeTab === 'previous-bookings' ? 'block' : 'hidden'
				}  h-[40vh] overflow-auto`}
			>
				<CurrentTable
					bookings={bookings.Previous}
					selectRow={selectRow}
					selectedRow={selectedRow}
				/>
			</div>
			<div className='mt-4'>
				<div className='flex justify-between'>
					{isEmpty ? (
						<button
							className='bg-green-500 text-white py-2 px-4 rounded'
							onClick={handleCreateNewBookingWithTelephone}
						>
							New Booking
						</button>
					) : (
						<>
							{selectedRow !== undefined && selectedRow !== null ? (
								<button
									className='bg-green-500 text-white py-2 px-4 rounded'
									onClick={confirmSelection}
								>
									Confirm
								</button>
							) : (
								<button
									disabled
									className='bg-gray-500 text-white py-2 px-4 rounded'
									onClick={confirmSelection}
								>
									select one
								</button>
							)}
						</>
					)}
					<button
						className='bg-red-500 text-white py-2 px-4 rounded'
						onClick={() => onSet(false)}
					>
						cancel
					</button>
				</div>
			</div>
		</div>
	);
};

function CurrentTable({ bookings, selectedRow, selectRow }) {
	const rows = ['Pickup Address', 'Destination Address', 'Name', 'Price'];

	if (bookings.length === 0) 
		return <div>No bookings</div>;

	return (
		<table className='min-w-full table-auto'>
			<thead>
				<tr>
					{rows.map((row, index) => (
						<th key={index} className='px-4 py-2 uppercase' >
							{row}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{bookings.map((booking, index) => (
					<tr
						key={index}
						className={`hover:bg-gray-300 cursor-pointer ${
							selectedRow === index ? 'bg-gray-300' : ''
						}`}
						onClick={() => selectRow(index)}
					>
						<td className='border px-4 py-2'>{booking.PickupAddress}</td>
						<td className='border px-4 py-2'>{booking.DestinationAddress}</td>
						<td className='border px-4 py-2'>{booking.PassengerName}</td>
						<td className='border px-4 py-2'>{booking.Price}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default BookingTable;
