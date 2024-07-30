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
		removeCaller(state, action) {
			return state.filter((caller, index) => index !== action.payload.id);
		},
	},
});
