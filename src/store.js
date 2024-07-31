/** @format */
import { configureStore } from '@reduxjs/toolkit';

import bookingFormReducer from './context/bookingSlice';
import caller from './context/callerSlice';

const store = configureStore({
	reducer: {
		bookingForm: bookingFormReducer,
		caller,
	},
});

export default store;
