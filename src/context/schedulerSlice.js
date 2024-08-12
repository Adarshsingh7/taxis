/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	deleteSchedulerBooking as deleteBooking,
	allocateDriver,
	completeBookings,
} from '../utils/apiReq';

const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState: {
		bookings: [],
		currentlySelectedBookingIndex: -1,
		selectedDriver: null,
		activeDate: new Date().toISOString(),
		activeComplete: false,
	},
	reducers: {
		insertBookings: (state, action) => {
			state.bookings = action.payload;
		},
		removeBooking: (state, action) => {
			state.bookings.splice(action.payload, 1);
		},
		completeActiveBookingStatus: (state, action) => {
			state.activeComplete = action.payload;
		},
		changeActiveDate: (state, action) => {
			state.activeDate = new Date(action.payload).toISOString();
		},
		selectBookingFromScheduler: (state, action) => {
			state.currentlySelectedBookingIndex = action.payload;
		},
		selectDriver: (state, action) => {
			state.selectedDriver = action.payload;
		},
		setActiveBookingIndex: (state, action) => {
			state.bookings.forEach((booking, index) => {
				if (booking.bookingId === action.payload) {
					state.currentlySelectedBookingIndex = index;
					return;
				}
			});
		},
	},
});

export function getRefreshedBookings() {
	function transformData(bookings) {
		return bookings.map((booking) => {
			let subjectString = '';
			if (booking.scope === 0 && booking.status !== 2) {
				subjectString = `${booking.pickupAddress} - ${booking.destinationAddress}`;
			}
			if (booking.scope === 0 && booking.status === 2) {
				subjectString = `[R]:${booking.pickupAddress} - ${booking.destinationAddress}`;
			}
			if (booking.scope === 1 && booking.status !== 2) {
				subjectString = booking.passengerName;
			}
			if (booking.scope === 1 && booking.status === 2) {
				subjectString = `[R]:${booking.passengerName}`;
			}
			return {
				...booking,
				subject: subjectString,
			};
		});
	}
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { activeDate, activeComplete } = getState().scheduler;

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
			dispatch(
				schedulerSlice.actions.insertBookings(transformData(filteredBookings))
			);
		}
		return response;
	};
}

export function deleteSchedulerBooking(cancelBlock, fullName, id) {
	return async (dispatch, getState) => {
		const { bookings, currentlySelectedBookingIndex: index } =
			getState().scheduler;
		const testMode = getState().bookingForm.isActiveTestMode;
		if (index === -1) return;
		const bookingId = bookings[index].bookingId;

		const reqData = {
			bookingId,
			cancelledByName: fullName,
			actionByUserId: id,
			cancelBlock,
		};

		const data = await deleteBooking(reqData, testMode);
		if (data.status === 'success') {
			dispatch({ type: 'scheduler/removeBooking', payload: index });
		}
		return data;
	};
}

export function allocateBookingToDriver(actionByUserId) {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { bookings, currentlySelectedBookingIndex, selectedDriver } =
			getState().scheduler;
		const currentBooking = bookings[currentlySelectedBookingIndex];

		const requestBody = {
			bookingId: currentBooking.bookingId,
			userId: selectedDriver,
			actionByUserId,
		};

		const data = await allocateDriver(requestBody, activeTestMode);
		if (data.status === 'success') {
			console.log('allocated');
			dispatch(getRefreshedBookings());
		}
		return data;
	};
}

export function handleCompleBooking({
	waitingTime,
	parkingCharge,
	priceAccount,
	driverPrice,
}) {
	return async (dispatch, getState) => {
		const { bookings, currentlySelectedBookingIndex: index } =
			getState().scheduler;
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { bookingId } = bookings[index].bookingId;
		const response = await completeBookings(
			{
				bookingId,
				waitingTime,
				parkingCharge,
				priceAccount,
				driverPrice,
			},
			activeTestMode
		);

		if (response === 'success') {
			dispatch(getRefreshedBookings());
		}
		return response;
	};
}

export const {
	completeActiveBookingStatus,
	changeActiveDate,
	setActiveBookingIndex,
	selectDriver,
} = schedulerSlice.actions;

export default schedulerSlice.reducer;
