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

	function filterFiled(data) {
		return {
			returnBooking: false,
			PickupAddress: data.PickupAddress || '',
			PickupPostCode: data.PickupPostCode || '',
			DestinationAddress: data.DestinationAddress || '',
			DestinationPostCode: data.DestinationPostCode || '',
			PickupDateTime: data.PickupDateTime || new Date(),
			returnTime: '',
			isReturn: false,
			vias: [],
			Passengers: data.Passengers || 1,
			hours: data.hours || 0,
			minutes: data.minutes || 20,
			durationText: '20',
			isAllDay: false,
			PassengerName: data.PassengerName || '',
			PhoneNumber: data.PhoneNumber || '',
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
			Price: data.Price,
			chargeFromBase: false,
			paymentStatus: 0,
			priceAccount: data.priceAccount || 0,
			driver: {},
		};
	}

	// the simple use effect to open the popup or modal
	useEffect(() => {
		if (callerId.Telephone) {
			setOpen(true);
		}
	}, [callerId]);

	function handleSubmit(data) {
		insertData(filterFiled(data));

		navigate('/pusher');
		setOpen(false);
	}

	return (
		<Modal
			open={open}
			setOpen={setOpen}
		>
			<CallerTable
				bookings={callerId}
				onConfirm={handleSubmit}
				onSet={setOpen}
			/>
		</Modal>
	);
}
export default CallerIdPopUp;
