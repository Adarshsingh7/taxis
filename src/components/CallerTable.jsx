/** @format */

import { useState, useEffect, useCallback } from 'react';
import 'tailwindcss/tailwind.css';
import { useBooking } from '../hooks/useBooking';

const BookingTable = ({ bookings, onConfirm, onSet, numBooking }) => {
	const [activeTab, setActiveTab] = useState(
		bookings.Current.length > 0 ? 'current-bookings' : 'previous-bookings'
	);

	const [selectedRow, setSelectedRow] = useState(0);
	const isEmpty =
		bookings.Current.length === 0 && bookings.Previous.length === 0;
	const { onRemoveCaller } = useBooking();

	const confirmSelection = useCallback(() => {
		const formatDate = (dateStr) => {
			const date = new Date(dateStr);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
				2,
				'0'
			)}-${String(date.getDate()).padStart(2, '0')}T${String(
				date.getHours()
			).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
		};

		if (selectedRow !== null) {
			const selectedBooking =
				activeTab === 'current-bookings'
					? bookings.Current[selectedRow]
					: bookings.Previous[selectedRow];
			selectedBooking.type =
				activeTab === 'current-bookings' ? 'current' : 'previous';
			selectedBooking.PickupDateTime =
				activeTab === 'current-bookings'
					? formatDate(selectedBooking.PickupDateTime)
					: formatDate(new Date());
			onConfirm(selectedBooking);
		} else {
			alert('No row selected');
		}
	}, [selectedRow, activeTab, bookings, onConfirm]);

	useEffect(() => {
		const traverseTable = (key) => {
			const currentBookings =
				activeTab === 'current-bookings' ? bookings.Current : bookings.Previous;
			if (currentBookings.length === 0) return;

			if (key === 'ArrowUp' && selectedRow > 0) {
				setSelectedRow(selectedRow - 1);
			} else if (
				key === 'ArrowDown' &&
				selectedRow < currentBookings.length - 1
			) {
				setSelectedRow(selectedRow + 1);
			}
		};
		const switchTab = (key) => {
			if (key === 'ArrowLeft' && activeTab === 'previous-bookings') {
				handleTabClick('current-bookings');
			} else if (key === 'ArrowRight' && activeTab === 'current-bookings') {
				handleTabClick('previous-bookings');
			}
		};
		const handleKeyDown = (event) => {
			event.preventDefault();
			console.log(event.key);
			if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				switchTab(event.key);
			} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				traverseTable(event.key);
			} else if (event.key === 'Enter') {
				confirmSelection();
			} else if (event.key === 'Escape') {
				onRemoveCaller();
				onSet(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		activeTab,
		selectedRow,
		bookings,
		confirmSelection,
		onRemoveCaller,
		onSet,
	]);

	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setSelectedRow(0);
	};

	const selectRow = (index) => {
		setSelectedRow(index);
	};

	function handleCreateNewBookingWithTelephone() {
		onConfirm({ PhoneNumber: bookings.Telephone });
	}

	return (
		<div className='w-[75vw] mx-auto bg-white rounded-lg shadow-lg p-5'>
			<div className='flex justify-between'>
				<h2 className='text-xl font-semibold mb-4 '>
					📞 ({bookings.Telephone})
				</h2>
				<span className='text-center bg-red-700 p-2 text-white'>
					{numBooking} Caller Waiting..
				</span>
			</div>
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
				} min-h-[15vh] max-h-[40vh] overflow-auto`}
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
				} min-h-[15vh] max-h-[40vh] overflow-auto`}
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
						onClick={() => {
							onRemoveCaller();
							onSet(false);
						}}
					>
						cancel
					</button>
				</div>
			</div>
		</div>
	);
};

function CurrentTable({ bookings, selectedRow, selectRow }) {
	const rows = [
		'Date',
		'Pickup Address',
		'Destination Address',
		'Name',
		'Price',
	];
	const formatDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(
			-2
		)}/${d.getFullYear().toString().slice(-2)} ${('0' + d.getHours()).slice(
			-2
		)}:${('0' + d.getMinutes()).slice(-2)}`;
	};

	if (bookings.length === 0) return <div>No bookings</div>;

	return (
		<table className='min-w-full table-auto'>
			<thead>
				<tr>
					{rows.map((row, index) => (
						<th
							key={index}
							className='px-4 py-2 uppercase'
						>
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
						<td className='border px-4 py-2 whitespace-nowrap'>
							{formatDate(booking.PickupDateTime)}
						</td>
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
