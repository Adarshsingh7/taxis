/** @format */

import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const callerSlice = createSlice({
	name: 'caller',
	initialState,
	reducers: {
		addCaller(state, action) {
			state.push(action.payload);
		},
		removeCaller(state) {
			state.shift();
		},
	},
});

export const addCallerToBooking = function (selectedRow, activeTab) {
	return function (dispatch, getState) {
		const type = activeTab === 'current-booking' ? 'Current' : 'Previous';
		let targetCallerData = getState().caller[0][type][selectedRow];

		targetCallerData = {
			...targetCallerData,
			bookingType: type,
			PickupDateTime:
				type === 'Current' ? targetCallerData.PickupDateTime : new Date(),
			// Add any additional properties you want to extend here
		};

		dispatch({ type: 'bookingForm/addData', payload: targetCallerData });
		dispatch({ type: 'caller/removeCaller' });
	};
};

export const { addCaller, removeCaller } = callerSlice.actions;

export default callerSlice.reducer;
