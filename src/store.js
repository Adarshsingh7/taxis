/** @format */
import { configureStore } from '@reduxjs/toolkit';

import bookingFormReducer from './context/bookingSlice';

const store = configureStore({
	reducer: {
		bookingForm: bookingFormReducer,
	},
});

export default store;
