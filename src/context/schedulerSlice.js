/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	deleteSchedulerBooking as deleteBooking,
	allocateDriver,
	completeBookings,
	bookingFindByKeyword,
} from '../utils/apiReq';
import { transformData } from '../utils/transformDataForBooking';
import axios from 'axios';

const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState: {
		bookings: [],
		currentlySelectedBookingIndex: -1,
		selectedDriver: null,
		activeDate: new Date().toISOString(),
		activeComplete: false,
		activeSearch: false,
		activeSearchResults: [],
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
		makeSearchActive: (state, action) => {
			state.activeSearch = true;
			state.activeSearchResults = action.payload;
		},
		makeSearchInactive: (state) => {
			state.activeSearch = false;
			state.activeSearchResults = [];
		},
	},
});

export function getRefreshedBookings() {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { activeDate, activeComplete } = getState().scheduler;

		const response = await getBookingData(activeDate, activeTestMode);

		if (response.status === 'success') {
			let filteredBookings = [];
			if (activeComplete) {
				filteredBookings = response.bookings;
				// filteredBookings = response.bookings.filter(
				// 	(booking) => booking.status === 3
				// );
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
		const isActiveTestMode = getState().bookingForm.isActiveTestMode;

		const requestBody = {
			bookingId: currentBooking.bookingId,
			userId: selectedDriver,
			actionByUserId,
		};

		const data = await allocateDriver(requestBody, activeTestMode);
		if (data.status === 'success' && isActiveTestMode) {
			const notification = await axios.get(
				`https://mobile-notifiation-registraion.onrender.com/8`
			);
			console.log(notification);
			if (notification.status === 200) {
				const expoToken = notification.data.data.expoNotificationToken;
				await axios.post(
					'https://mobile-notifiation-registraion.onrender.com/send-notification',
					{
						to: expoToken,
						title: 'Got a new booking',
						body: 'You have been allocated a new booking. Please check the app for more details.',
						data: currentBooking,
					}
				);
			}

			dispatch(getRefreshedBookings());
		}
		return data;
	};
}

export function handleCompleteBooking({
	waitingTime,
	parkingCharge,
	priceAccount,
	driverPrice,
}) {
	return async (dispatch, getState) => {
		const { bookings, currentlySelectedBookingIndex: index } =
			getState().scheduler;
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const bookingId = bookings[index].bookingId;

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

export const handleSearchBooking = function (keyword) {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const res = await bookingFindByKeyword(keyword, activeTestMode);
		if (res.status === 'success') {
			const results = transformData(
				res.bookings.filter((booking) => booking.cancelled === false)
			);
			dispatch(schedulerSlice.actions.makeSearchActive(results));
		}
	};
};

export const {
	completeActiveBookingStatus,
	changeActiveDate,
	setActiveBookingIndex,
	selectDriver,
	makeSearchInactive,
} = schedulerSlice.actions;

export default schedulerSlice.reducer;
