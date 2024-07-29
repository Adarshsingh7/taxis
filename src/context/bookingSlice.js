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

const bookingFormReducer = createSlice({
	name: 'bookingForm',
	initialState,
	reducers: {
		updateValue(state, action) {
			const { itemIndex, property, value } = action.payload;
			state[itemIndex][property] = value;
		},
		addData(state, action) {
			state.push(action.payload);
		},
		endBooking(state, action) {
			const { itemIndex } = action.payload;
			if (itemIndex === 0) {
				Object.assign(state[0], initialState[0]);
			} else {
				state.splice(itemIndex, 1);
			}
		},
	},
});

export const { updateValue, addData, endBooking } = bookingFormReducer.actions;

export default bookingFormReducer.reducer;
