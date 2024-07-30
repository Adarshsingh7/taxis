/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { makeBooking } from './../utils/apiReq';

const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		'0'
	)}-${String(date.getDate()).padStart(2, '0')}T${String(
		date.getHours()
	).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const initialState = [
	{
		returnBooking: false,
		bookedByName: '',
		PickupAddress: '',
		PickupPostCode: '',
		DestinationAddress: '',
		DestinationPostCode: '',
		PickupDateTime: formatDate(new Date()),
		returnTime: '',
		isReturn: false,
		vias: [],
		Passengers: 1,
		hours: 0,
		minutes: 20,
		durationText: '20',
		isAllDay: false,
		PassengerName: '',
		PhoneNumber: '',
		Email: '',
		repeatBooking: false,
		recurrenceRule: '',
		frequency: 'none',
		repeatEnd: 'never',
		repeatEndValue: '',
		details: '',
		Price: 0,
		scope: 0,
		chargeFromBase: false,
		paymentStatus: 0,
		driver: {},
		accountNumber: 0,
		priceAccount: 0,
		userId: '',
		formBusy: false,
		isLoading: false,
	},
];

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
				state[itemIndex][property] = value;
			},
		},
		addData(state, action) {
			state.push(action.payload);
		},
		endBooking(state, action) {
			const { itemIndex } = action.payload;
			if (itemIndex === 0) {
				state[itemIndex] = initialState[0];
			} else {
				state.splice(itemIndex, 1);
			}
		},
	},
});

export const updateValue = function (itemIndex, property, value) {
	return function (dispatch, getState) {
		const targetBooking = getState().bookingForm[itemIndex];
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

export const { addData, endBooking } = bookingFormSlice.actions;

export const onCreateBooking = (itemIndex) => async (dispatch, getState) => {
	const targetBooking = getState().bookingForm[itemIndex];
	const response = await makeBooking(targetBooking, true);
	if (response.status === 'success') {
		dispatch(endBooking({ itemIndex }));
		return { status: 'success' };
	} else {
		dispatch(updateValue({ itemIndex, property: 'isLoading', value: false }));
		return { status: 'error', message: response.message };
	}
};

export const onUpdateBooking = (itemIndex) => async (dispatch, getState) => {
	dispatch(updateValue({ itemIndex, property: 'isLoading', value: true }));
	const targetBooking = getState().bookingForm[itemIndex];
	const response = await makeBooking(targetBooking);
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
		dispatch({
			type: 'bookingForm/updateDataValue',
			payload: { itemIndex, property, value },
		});
	};

export const removeBooking = (itemIndex) => (dispatch) => {
	dispatch(endBooking({ itemIndex }));
};

export default bookingFormSlice.reducer;
