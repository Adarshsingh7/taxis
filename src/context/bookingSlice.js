/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { makeBooking, updateBooking } from './../utils/apiReq';
import { formatDate } from './../utils/formatDate';

// Filter data to avoid undefined values and make the data structure consistent
const filterData = (data = {}) => ({
	details: data.Details || '',
	email: data.Email || '',
	bookingId: data.Id || null,
	durationText: Number(data.durationText) ? String(data.durationText) : '20',
	durationMinutes: data.durationMinutes || 0,
	isAllDay: data.IsAllDay || false,
	passengerName: data.PassengerName || '',
	passengers: data.Passengers || 1,
	paymentStatus: data.PaymentStatus || 0,
	scope: data.Scope || 0,
	phoneNumber: data.PhoneNumber || '',
	pickupAddress: data.PickupAddress || '',
	pickupDateTime: data.PickupDateTime
		? formatDate(new Date(data.PickupDateTime))
		: formatDate(new Date()),
	pickupPostCode: data.PickupPostCode || '',
	destinationAddress: data.DestinationAddress || '',
	destinationPostCode: data.DestinationPostCode || '',
	recurrenceRule: data.RecurrenceRule || '',
	price: data.Price || 0,
	priceAccount: data.PriceAccount || 0,
	chargeFromBase: true,
	userId: data.UserId || null,
	returnDateTime: data.ReturnDateTime || null,
	vias: data.Vias || [],
	accountNumber: data.AccountNumber || 9999,
	bookedByName: data.BookedByName || '',
	returnBooking: data.ReturnBooking || false,
	isReturn: data.IsReturn || false,
	repeatBooking: data.RepeatBooking || false,
	frequency: data.Frequency || 'none',
	repeatEnd: data.RepeatEnd || 'never',
	repeatEndValue: data.RepeatEndValue || '',
	driver: data.Driver || {},
	formBusy: data.FormBusy || false,
	isLoading: data.IsLoading || false,
	bookingType: data.bookingType || 'New',
	quoteOptions: null,
	hours: data.Hours ?? 0,
	minutes: data.Minutes ?? 20,
});

const initialState = {
	bookings: [filterData()],
	isLoading: false,
	error: null,
	activeBookingIndex: 0,
	isActiveTestMode: true,
};

const bookingFormSlice = createSlice({
	name: 'bookingForm',
	initialState,
	reducers: {
		// update the specific value of the booking form data based on the itemIndex
		updateDataValue: {
			prepare(itemIndex, property, value) {
				return { payload: { itemIndex, property, value } };
			},
			reducer(state, action) {
				const { itemIndex, property, value } = action.payload;
				state.bookings[itemIndex][property] = value;
			},
		},
		// add new booking data to the booking form basically to from the CLI caller events
		addData(state, action) {
			state.bookings.push(filterData(action.payload));
			state.activeBookingIndex = state.bookings[state.activeBookingIndex]
				.formBusy
				? state.activeBookingIndex
				: state.bookings.length - 1;
		},
		addDataFromSchedulerInEditMode(state, action) {
			const data = filterData({});
			data.bookingType = 'Current';
			action.payload = {
				...action.payload,
				pickupDateTime: formatDate(action.payload.pickupDateTime),
			};
			console.log(action.payload);

			state.bookings.push({ ...data, ...action.payload});
			state.activeBookingIndex = state.bookings.length - 1;
		},
		// to remove a booking session from the booking form data and from the UI
		endBooking(state) {
			const itemIndex = state.activeBookingIndex;
			if (itemIndex === 0) {
				state.bookings[itemIndex] = initialState.bookings[0];
			} else {
				state.bookings.splice(itemIndex, 1);
				state.activeBookingIndex -= 1;
			}
		},
		// this function simply updates the booking key value pair of the booking
		updateBookingData(state, action) {
			const currentBooking = state.bookings[state.activeBookingIndex];
			state.bookings[state.activeBookingIndex] = {
				...currentBooking,
				...action.payload,
			};
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		// changes active tab which makes the flow of form data
		setActiveTabChange(state, action) {
			state.activeBookingIndex = action.payload;
		},
		// sets the mode of app from live to test or vice versa
		setActiveTestMode(state, action) {
			state.isActiveTestMode = action.payload;
		},
		// this controller if used to create new booking from scheduler free spaces
		createBookingFromScheduler(state, action) {
			const data = filterData({
				PickupDateTime: action.payload,
				bookingType: 'Previous',
				FormBusy: true,
			});
			const formBusy = state.bookings[state.activeBookingIndex].formBusy;
			if (!formBusy && state.activeBookingIndex === 0) {
				data.bookingType = '';
				state.bookings[state.activeBookingIndex] = data;
			} else {
				state.bookings.push(data);
				state.activeBookingIndex = state.bookings.length - 1;
			}
		},
	},
});

// Action Creator that will indirectly call the updateDataValue with and set FormBusy
export const updateValue = function (itemIndex, property, value) {
	return function (dispatch, getState) {
		const targetBooking = getState().bookingForm.bookings[itemIndex];
		if (!targetBooking.formBusy) {
			dispatch(
				bookingFormSlice.actions.updateDataValue(itemIndex, 'formBusy', true)
			);
		}
		dispatch(
			bookingFormSlice.actions.updateDataValue(itemIndex, property, value)
		);
	};
};

// Action Creator that will indirectly call the updateDataValue without and set FormBusy
export const updateValueSilentMode =
	(itemIndex, property, value) => (dispatch) => {
		dispatch(
			bookingFormSlice.actions.updateDataValue(itemIndex, property, value)
		);
	};

// Action Creator that will save the booking to the Backend api and return the response
export const onCreateBooking = (itemIndex) => async (dispatch, getState) => {
	const targetBooking = getState().bookingForm.bookings[itemIndex];
	const activeTestMode = getState().bookingForm.isActiveTestMode;
	const response = await makeBooking(targetBooking, activeTestMode);
	if (response.status === 'success') {
		dispatch(endBooking({ itemIndex }));
		return { status: 'success' };
	} else {
		dispatch(
			bookingFormSlice.actions.updateDataValue(itemIndex, 'isLoading', false)
		);
		return { status: 'error', message: response.message };
	}
};

// Action Creator that will update the booking to the Backend api and return the response
export const onUpdateBooking = (itemIndex) => async (dispatch, getState) => {
	const targetBooking = getState().bookingForm.bookings[itemIndex];
	const activeTestMode = getState().bookingForm.isActiveTestMode;
	const response = await updateBooking(targetBooking, activeTestMode);
	if (response.status === 'success') {
		dispatch(endBooking({ itemIndex }));
		return { status: 'success' };
	} else {
		dispatch(updateValue({ itemIndex, property: 'isLoading', value: false }));
		return { status: 'error', message: response.message };
	}
};

// Action Creator that will remove the booking from the booking form data
export const removeBooking = (itemIndex) => (dispatch) => {
	dispatch(endBooking({ itemIndex }));
};

export const {
	addData,
	endBooking,
	setActiveTabChange,
	setActiveTestMode,
	updateBookingData,
	addDataFromSchedulerInEditMode,
	createBookingFromScheduler,
} = bookingFormSlice.actions;

export default bookingFormSlice.reducer;
