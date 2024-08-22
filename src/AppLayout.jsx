/** @format */

import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import CallerIdPopUp from './components/CallerIdPopUp';
import { Provider } from 'react-redux';
import store from './store';
import Footer from './ui/Footer';

function AppLayout() {
	return (
		<AuthProvider>
			<BookingProvider>
				<Provider store={store}>
					<CallerIdPopUp />
					<Header />
					<Outlet />
					<Footer />
				</Provider>
			</BookingProvider>
		</AuthProvider>
	);
}

export default AppLayout;
