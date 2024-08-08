/** @format */
import { configureStore } from '@reduxjs/toolkit';

import bookingFormReducer from './context/bookingSlice';
import caller from './context/callerSlice';
import snackbarReducer from './context/snackbarSlice';
import schedulerReducer from './context/schedulerSlice';

const store = configureStore({
	reducer: {
		bookingForm: bookingFormReducer,
		caller,
		snackbar: snackbarReducer,
		scheduler: schedulerReducer,
	},
});

export default store;
