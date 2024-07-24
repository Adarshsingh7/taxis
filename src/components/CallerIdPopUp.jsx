/** @format */

import Modal from './Modal';
import { useBooking } from '../hooks/useBooking';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CallerTable from './CallerTable';

function CallerIdPopUp() {
	const { callerId, insertData, onRemoveCaller, isCurrentTabActive } =
		useBooking();
	const [open, setOpen] = useState(callerId.length ? true : false);
	const navigate = useNavigate();
	const isEmpty =
		callerId[0]?.Current?.length === 0 && callerId[0]?.Previous?.length === 0;
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
			bookedByName: data.BookedByName || '',
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
			durationText: data.DurationText || 20,
			isAllDay: data.IsAllDay || false,
			PassengerName: data.PassengerName || '',
			PhoneNumber: data.PhoneNumber || '',
			bookingId: data.Id || '',
			bookingType: data.type || '',
			updateByName: '',
			Email: data.Email || '',
			repeatBooking: false,
			recurrenceRule: data.RecurrenceRule || '',
			frequency: 'none',
			repeatEnd: 'never',
			repeatEndValue: '',
			details: data.Details || '',
			scope: 0,
			accountNumber: data.AccountNumber || 0,
			Price: data.Price || 0,
			chargeFromBase: data.ChargeFromBase || false,
			paymentStatus: data.PaymentStatus || 0,
			priceAccount: data.PriceAccount || 0,
			driver: {},
			formBusy: false,
		};
	}

	// the simple use effect to open the popup or modal
	useEffect(() => {
		if (callerId[0]?.Telephone && !isEmpty) {
			setOpen(true);
		}
	}, [callerId, isEmpty]);

	useEffect(() => {
		if (isCurrentTabActive) return;
		if (callerId.length > 0) setOpen(true);
	}, [callerId.length, isCurrentTabActive]);

	function handleSubmit(data) {
		insertData(filterFiled(data));
		onRemoveCaller();
		navigate('/pusher');
		setOpen(false);
	}

	if (isCurrentTabActive) return null;

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			disableEscapeKeyDown={true}
		>
			{!isEmpty && (
				<CallerTable
					bookings={callerId[0]}
					numBooking={callerId.length}
					onConfirm={handleSubmit}
					onSet={setOpen}
				/>
			)}
		</Modal>
	);
}
export default CallerIdPopUp;
