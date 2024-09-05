/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	deleteSchedulerBooking as deleteBooking,
	allocateDriver,
	completeBookings,
	bookingFindByKeyword,
	bookingFindByTerm,
	findBookingById,
} from '../utils/apiReq';
import axios from 'axios';

const filterScheduledBookings = function (booking) {
	return {
		bookingId: booking.bookingId,
		bookingTime: booking.bookingTime,
		pickupDateTime: booking.pickupDate,
		endTime: booking.endDate || booking.pickupDate,
		backgroundColorRGB: booking.color,
		subject: booking.cellText,
		...booking,
	};
};

const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState: {
		bookings: [],
		loading: false,
		currentlySelectedBookingIndex: -1,
		selectedDriver: null,
		activeDate: new Date().toISOString(),
		activeComplete: false,
		activeSearch: false,
		activeSearchResults: [],
		activeSearchResult: null,
		showDriverAvailability: false,
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
		setActiveSearchResultClicked: (state, action) => {
			state.activeSearchResult = action.payload;
		},
		changeShowDriverAvailability: (state, action) => {
			state.showDriverAvailability = action.payload;
		},
		updateBookingAtIndex: (state, action) => {
			state.bookings.forEach((booking, index) => {
				if (booking.bookingId === action.payload.bookingId) {
					state.bookings[index] = action.payload;
					return;
				}
			});
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
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
			dispatch(schedulerSlice.actions.insertBookings(filteredBookings));
		}
		return response;
	};
}

export function deleteSchedulerBooking(
	cancelBlock,
	fullName,
	id,
	cancelledOnArrival = false
) {
	return async (dispatch, getState) => {
		console.log({ cancelBlock, fullName, id });
		const {
			bookings,
			currentlySelectedBookingIndex: index,
			activeSearch,
			activeSearchResult,
		} = getState().scheduler;
		const testMode = getState().bookingForm.isActiveTestMode;
		if (index === -1 && !activeSearch) return;
		const bookingId = activeSearch
			? activeSearchResult.bookingId
			: bookings[index].bookingId;
		console.log({ bookingId });

		const reqData = {
			bookingId,
			cancelledByName: fullName,
			actionByUserId: id,
			cancelBlock,
			cancelledOnArrival: cancelledOnArrival,
		};

		const data = await deleteBooking(reqData, testMode);
		if (data.status === 'success' && cancelledOnArrival === false) {
			dispatch({ type: 'scheduler/removeBooking', payload: index });
		}
		return data;
	};
}

export function allocateBookingToDriver(actionByUserId) {
	return async (dispatch, getState) => {
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const {
			bookings,
			currentlySelectedBookingIndex,
			selectedDriver,
			activeSearch,
			activeSearchResult,
		} = getState().scheduler;
		const currentBooking = activeSearch
			? activeSearchResult
			: bookings[currentlySelectedBookingIndex];
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
			// console.log(notification);
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
		const {
			bookings,
			currentlySelectedBookingIndex: index,
			activeSearch,
			activeSearchResult,
		} = getState().scheduler;
		const activeTestMode = getState().bookingForm.isActiveTestMode;
		const bookingId = activeSearch
			? activeSearchResult.bookingId
			: bookings[index].bookingId;

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
		// const res = await bookingFindByKeyword(keyword, activeTestMode);
		// if (res.status === 'success') {
		// 	const results =
		// 		res.bookings.filter((booking) => booking.cancelled === false)
		// 	;
		// 	console.log(results);
		// 	dispatch(schedulerSlice.actions.makeSearchActive(results));
		// }
		dispatch(schedulerSlice.actions.setLoading(true));
		const res = await bookingFindByTerm(keyword, activeTestMode);
		dispatch(schedulerSlice.actions.setLoading(false));
		if (res.status === 'success') {
			const results = res.results
				.filter((booking) => booking.cancelled === false)
				.map((el) => filterScheduledBookings(el));
			dispatch(schedulerSlice.actions.makeSearchActive(results));
		}
	};
};

export const setActiveSearchResult = function (bookingId, activeTestMode) {
	return async (dispatch) => {
		const data = await findBookingById(bookingId, activeTestMode);
		if (data.status === 'success') {
			dispatch(schedulerSlice.actions.setActiveSearchResultClicked(data));
			console.log(data);
		}
	};
};

export const {
	completeActiveBookingStatus,
	changeActiveDate,
	setActiveBookingIndex,
	selectDriver,
	makeSearchInactive,
	changeShowDriverAvailability,
	updateBookingAtIndex,
	setActiveSearchResultClicked,
} = schedulerSlice.actions;

export default schedulerSlice.reducer;
