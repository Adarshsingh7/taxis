/** @format */

import { useContext } from 'react';
import { BookingContext } from '../context/BookingContext';

function useBooking() {
	const context = useContext(BookingContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
}

export { useBooking };
