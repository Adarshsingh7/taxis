/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	deleteSchedulerBooking as deleteBooking,
	allocateDriver,
} from '../utils/apiReq';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';

const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState: {
		bookings: [],
		currentlySelectedBookingIndex: -1,
		selectedDriver: null,
		activeDate: formatDate(new Date()),
	},
	reducer: {
		insertBookings: (state, action) => {
			state.bookings = action.payload;
		},
		removeBooking: (state, action) => {
			state.bookings = state.bookings.splice(action.payload, 1);
		},
	},
});

export function getRefreshedBooking() {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const activeDate = getState().scheduler.activeDate;

		const response = await getBookingData(activeDate, activeTestMode);

		console.log(response);
		if (response.status === 'success') {
			dispatch({
				type: 'scheduler/insertBooking',
				payload: { bookings: response },
			});
			schedulerSlice.actions.insertBookings(response.bookings);
		}
		return response;
	};
}

export function deleteSchedulerBooking(cancelBlock) {
	return async (dispatch, getState) => {
		const { bookings, currentlySelectedBookingIndex: index } =
			getState().scheduler;
		const testMode = getState().bookingForm.isActiveTestMode;
		if (index === -1) return;
		const bookingId = bookings[index].bookingId;
		const { fullName, id } = useAuth().currentUser;

		const reqData = {
			bookingId,
			cancelledByName: fullName,
			actionByUserId: id,
			cancelBlock,
		};

		const data = await deleteBooking(reqData, testMode);
		dispatch({ type: 'scheduler/removeBooking', payload: { bookingId } });
		return data;
	};
}

export function allocateBookingToDriver(currentBooking, driverId) {
	return async (dispatch) => {
		const response = await allocateDriver(currentBooking, driverId);
		const data = await response.json();
		dispatch({ type: 'scheduler/insertBooking', payload: { bookings: data } });
	};
}

export default schedulerSlice.reducer;
