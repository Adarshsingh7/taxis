/** @format */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// test push

import Landing from './pages/Landing';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Login, SignUp } from './pages/Login';
import Dashboard from './pages/Dashboard';
import AboutMe from './components/AboutMe';
import AppLayout from './AppLayout';
import HashLoader from 'react-spinners/HashLoader';
import AceScheduler from './pages/Scheduler';
import Booking from './pages/Booking';
import Push from './pages/Pusher';
import Protected from './utils/Protected';
// import './components/LocationSuggestion';

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/',
				element: (
					<Protected>
						<Push />
					</Protected>
				),
			},
			{
				path: '/*',
				element: (
					<Protected>
						<Push />
					</Protected>
				),
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
