/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	deleteSchedulerBooking as deleteBooking,
} from '../utils/apiReq';

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
	};
}
