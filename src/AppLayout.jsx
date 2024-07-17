/** @format */

import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import CallerIdPopUp from './components/CallerIdPopUp';

function AppLayout() {
	return (
		<AuthProvider>
			<BookingProvider>
				<CallerIdPopUp />
				<Header />
				<Outlet />
			</BookingProvider>
		</AuthProvider>
	);
}

export default AppLayout;
