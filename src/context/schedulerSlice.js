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
		activeComplete: false,
	},
	reducers: {
		insertBookings: (state, action) => {
			console.log('action.payload');
			state.bookings = action.payload;
		},
		removeBooking: (state, action) => {
			state.bookings = state.bookings.splice(action.payload, 1);
		},
		completeActiveBookingStatus: (state, action) => {
			state.activeComplete = action.payload;
		},
		changeActiveDate: (state, action) => {
			state.activeDate = action.payload;
		},
		selectBookingFromScheduler: (state, action) => {
			state.currentlySelectedBookingIndex = action.payload;
		},
		selectDriver: (state, action) => {
			state.selectedDriver = action.payload;
		},
	},
});

export function getRefreshedBookings() {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { activeDate, activeComplete } = getState().scheduler.activeDate;

		const response = await getBookingData(activeDate, activeTestMode);

		if (response.status === 'success') {
			let filteredBookings = [];
			if (activeComplete) {
				filteredBookings = response.bookings.filter(
					(booking) => booking.status === 3
				);
			} else {
				filteredBookings = response.bookings.filter(
					(booking) => booking.status !== 3
				);
			}
			schedulerSlice.actions.insertBookings(filteredBookings);
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
		if (data.status === 'success') {
			dispatch({ type: 'scheduler/removeBooking', payload: { index } });
		}
		return data;
	};
}

export function allocateBookingToDriver() {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { bookings, currentlySelectedBookingIndex, selectedDriver } =
			getState().scheduler;
		const currentBooking = bookings[currentlySelectedBookingIndex];

		const requestBody = {
			bookingId: currentBooking.bookingId,
			userId: selectedDriver.userId,
			actionByUserId: useAuth().currentUser.id,
		};

		const data = await allocateDriver(requestBody, activeTestMode);
		if (data.status === 'success') {
			dispatch({
				type: 'scheduler/getRefreshedBookings',
			});
		}
	};
}

export const { completeActiveBookingStatus } = schedulerSlice.actions;

export default schedulerSlice.reducer;
