/** @format */
import { configureStore } from '@reduxjs/toolkit';

import bookingFormReducer from './context/bookingSlice';
import caller from './context/callerSlice';
import snackbarReducer from './context/snackbarSlice';

const store = configureStore({
	reducer: {
		bookingForm: bookingFormReducer,
		caller,
		snackbar: snackbarReducer,
	},
});

export default store;
