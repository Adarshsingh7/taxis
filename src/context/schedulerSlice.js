/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	deleteSchedulerBooking as deleteBooking,
	allocateDriver,
} from '../utils/apiReq';
import { type } from 'os';
import { scheduler } from 'timers/promises';

const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState: [],
	reducer: {
		insertBooking: (state, action) => {
			state = action.payload.bookings;
		},
		removeBooking: (state, action) => {
			state = state.filter(
				(booking) => booking.bookingId !== action.payload.bookingId
			);
		},
	},
});

export function getRefreshedBooking() {
	return async (dispatch) => {
		const response = await getBookingData();
		const data = await response.json();
		dispatch({ type: 'scheduler/insertBooking', payload: { bookings: data } });
	};
}

export function deleteSchedulerBooking(bookingId) {
	return async (dispatch) => {
		const response = await deleteBooking({
			bookingId,
			cancelledByName: 'Peter Ferrell',
			fullName: 'Peter Ferrell',
			actionByUserId: '8',
		});
		const data = await response.json();
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
