/** @format */

import Modal from './Modal';
import { useEffect, useState } from 'react';
import CallerTable from './CallerTable';
import { useDispatch, useSelector } from 'react-redux';
import { addCallerToBooking } from '../context/callerSlice';

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

	// the simple use effect to open the popup or modal
	useEffect(() => {
		if (caller[0]?.Telephone && !isEmpty) {
			setOpen(true);
		}
	}, [caller, isEmpty]);

	useEffect(() => {
		if (isCurrentTabActive) return;
		if (caller.length > 0) setOpen(true);
	}, [caller.length, isCurrentTabActive]);

	function handleSubmit(selectedRow, activeTab) {
		dispatch(addCallerToBooking(selectedRow, activeTab));
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
