/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { makeBooking, updateBooking } from './../utils/apiReq';
import { formatDate } from './../utils/formatDate';
const filterData = (data = {}) => ({
	details: data.Details || '',
	email: data.Email || '',
	durationText: data.DurationText || '20',
	isAllDay: data.IsAllDay || false,
	passengerName: data.PassengerName || '',
	passengers: data.Passengers || 1,
	paymentStatus: data.PaymentStatus || 0,
	scope: data.Scope || 0,
	phoneNumber: data.PhoneNumber || '',
	pickupAddress: data.PickupAddress || '',
	pickupDateTime: data.PickupDateTime || formatDate(new Date()),
	pickupPostCode: data.PickupPostCode || '',
	destinationAddress: data.DestinationAddress || '',
	destinationPostCode: data.DestinationPostCode || '',
	recurrenceRule: data.RecurrenceRule || '',
	price: data.Price || 0,
	priceAccount: data.PriceAccount || 0,
	chargeFromBase: data.ChargeFromBase || false,
	userId: data.UserId || null,
	returnDateTime: data.ReturnDateTime || null,
	vias:
		data.Vias?.map((el) => ({
			viaSequence: el.ViaSequence,
			postcode: el.PostCode,
			address: el.Address,
			id: el.Id,
		})) || [],
	accountNumber: data.AccountNumber || 0,
	bookedByName: data.BookedByName || '',
	returnBooking: data.ReturnBooking || false,
	isReturn: data.IsReturn || false,
	hours: data.Hours || 0,
	minutes: data.Minutes || 20,
	repeatBooking: data.RepeatBooking || false,
	frequency: data.Frequency || 'none',
	repeatEnd: data.RepeatEnd || 'never',
	repeatEndValue: data.RepeatEndValue || '',
	driver: data.Driver || {},
	formBusy: data.FormBusy || false,
	isLoading: data.IsLoading || false,
	bookingType: data.bookingType || 'New',
});

const initialState = {
	bookings: [filterData()],
	isLoading: false,
	error: null,
	activeBookingIndex: 0,
	isActiveTestMode: false,
};

const bookingFormSlice = createSlice({
	name: 'bookingForm',
	initialState,
	reducers: {
		updateDataValue: {
			prepare(itemIndex, property, value) {
				return { payload: { itemIndex, property, value } };
			},
			reducer(state, action) {
				const { itemIndex, property, value } = action.payload;
				state.bookings[itemIndex][property] = value;
			},
		},
		addData(state, action) {
			state.bookings.push(filterData(action.payload));
			state.activeBookingIndex = state.bookings.length - 1;
		},
		endBooking(state) {
			const itemIndex = state.activeBookingIndex;
			if (itemIndex === 0) {
				state.bookings[itemIndex] = initialState.bookings[0];
			} else {
				state.bookings.splice(itemIndex, 1);
				state.activeBookingIndex -= 1;
			}
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		setActiveTabChange(state, action) {
			state.activeBookingIndex = action.payload;
		},
		setActiveTestMode(state, action) {
			state.isActiveTestMode = action.payload;
		},
	},
});

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

export const updateValueSilentMode =
	(itemIndex, property, value) => (dispatch) => {
		dispatch(
			bookingFormSlice.actions.updateDataValue(itemIndex, property, value)
		);
	};

export const removeBooking = (itemIndex) => (dispatch) => {
	dispatch(endBooking({ itemIndex }));
};

export const { addData, endBooking, setActiveTabChange, setActiveTestMode } =
	bookingFormSlice.actions;

export default bookingFormSlice.reducer;
