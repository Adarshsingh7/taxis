/** @format */

import { createSlice } from '@reduxjs/toolkit';

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
	},
];

const bookingFormSlice = createSlice({
	name: 'bookingForm',
	initialState,
	reducers: {},
});
