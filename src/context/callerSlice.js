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
			state.splice(0, 1);
		},
	},
});

export const addCallerToBooking = function () {
	return function (dispatch, getState) {
		const targetCaller = getState().caller[0];
		dispatch({ type: 'bookingForm/addData', payload: targetCaller });
		dispatch({ type: 'caller/removeCaller' });
	};
};

export const { addCaller, removeCaller } = callerSlice.actions;

export default callerSlice.reducer;
