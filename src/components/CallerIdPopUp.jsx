/** @format */

import Modal from './Modal';
import { useEffect, useState } from 'react';
import CallerTable from './CallerTable';
import { useDispatch, useSelector } from 'react-redux';
import {
	addCallerToBooking,
	updateCurrentBookingWithLookup,
} from '../context/callerSlice';

function CallerIdPopUp() {
	const dispatch = useDispatch();
	const caller = useSelector((state) => state.caller);
	const bookingData = useSelector((state) => state.bookingForm);
	const [open, setOpen] = useState(caller.length ? true : false);
	const isEmpty =
		caller[0]?.Current?.length === 0 && caller[0]?.Previous?.length === 0;
	const isCurrentTabActive =
		bookingData.bookings[bookingData.activeBookingIndex].formBusy &&
		bookingData;

	const callerType = caller.length ? caller[0].callerType : null;

	// the simple use effect to open the popup or modal
	useEffect(() => {
		if (caller[0]?.Telephone && !isEmpty) {
			setOpen(true);
		}
	}, [caller, isEmpty]);

	useEffect(() => {
		if (callerType === 'lookup') {
			setOpen(true);
			return;
		}
		if (isCurrentTabActive) return;
		if (caller.length > 0) setOpen(true);
	}, [caller.length, isCurrentTabActive, callerType]);

	function handleSubmit(selectedRow, activeTab) {
		if (callerType === 'stack') {
			dispatch(addCallerToBooking(selectedRow, activeTab));
		} else if (callerType === 'lookup') {
			dispatch(updateCurrentBookingWithLookup(selectedRow, activeTab));
		}
		setOpen(false);
	}

	if (isCurrentTabActive && callerType === 'stack') return null;
	if (isEmpty) return null;

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			disableEscapeKeyDown={true}
		>
			{!isEmpty && (
				<CallerTable
					bookings={caller[0]}
					numBooking={caller.length}
					onConfirm={handleSubmit}
					onSet={setOpen}
				/>
			)}
		</Modal>
	);
}
export default CallerIdPopUp;
