/** @format */

import Modal from './Modal';
import { useBooking } from '../hooks/useBooking';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CallerTable from './CallerTable';

function CallerIdPopUp() {
	const { callerId, insertData } = useBooking();
	const [open, setOpen] = useState(callerId.length ? true : false);
	const navigate = useNavigate();
	const isEmpty =
		callerId.Current?.length === 0 && callerId.Previous?.length === 0;
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			'0'
		)}-${String(date.getDate()).padStart(2, '0')}T${String(
			date.getHours()
		).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	};

	function filterFiled(data) {
		return {
			returnBooking: false,
			PickupAddress: data.PickupAddress || '',
			PickupPostCode: data.PickupPostCode || '',
			DestinationAddress: data.DestinationAddress || '',
			DestinationPostCode: data.DestinationPostCode || '',
			PickupDateTime: data.PickupDateTime || formatDate(new Date()),
			returnTime: '',
			isReturn: false,
			vias:
				data?.Vias?.map((el) => ({
					viaSequence: el.ViaSequence,
					postcode: el.PostCode,
					address: el.Address,
					id: el.Id,
				})) || [],
			Passengers: data.Passengers || 1,
			hours: data.hours || 0,
			minutes: data.minutes || 20,
			durationText: '20',
			isAllDay: false,
			PassengerName: data.PassengerName || '',
			PhoneNumber: data.PhoneNumber || '',
			bookingId: data.BookingId || '',
			bookingType: data.type || '',
			updateByName: '',
			Email: data.Email || '',
			repeatBooking: false,
			recurrenceRule: '',
			frequency: 'none',
			repeatEnd: 'never',
			repeatEndValue: '',
			selectedDays: {
				sun: false,
				mon: false,
				tue: false,
				wed: false,
				thu: false,
				fri: true,
				sat: false,
			},
			details: '',
			scope: 0,
			accountNumber: 0,
			Price: 0,
			chargeFromBase: false,
			paymentStatus: 0,
			priceAccount: data.priceAccount || 0,
			driver: {},
		};
	}

	// the simple use effect to open the popup or modal
	useEffect(() => {
		if (callerId.Telephone && !isEmpty) {
			setOpen(true);
		}
	}, [callerId, isEmpty]);

	function handleSubmit(data) {
		insertData(filterFiled(data));
		console.log(filterFiled(data));

		navigate('/pusher');
		setOpen(false);
	}

	return (
		<Modal
			open={open}
			setOpen={setOpen}
		>
			{!isEmpty && (
				<CallerTable
					bookings={callerId}
					onConfirm={handleSubmit}
					onSet={setOpen}
				/>
			)}
		</Modal>
	);
}
export default CallerIdPopUp;
