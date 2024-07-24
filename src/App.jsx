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
import GoogleAutoComplete from './pages/GoogleAutoComplete';

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <Landing />,
			},
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/app',
				element: <AceScheduler />,
			},
			{
				path: '/pusher',
				element: (
					<Protected>
						<Push />
					</Protected>
				),
			},
			{
				path: '/create',
				element: (
					<Protected>
						<Booking />,
					</Protected>
				),
			},
			{
				path: '/google',
				element: <GoogleAutoComplete />,
			},
			{
				path: '/spinner',
				element: (
					<div className='h-screen w-full flex flex-col justify-evenly items-center'>
						<div></div>
						<HashLoader color='purple' />
						<div></div>
						<div></div>
					</div>
				),
			},
			{
				path: '/signup',
				element: <SignUp />,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,
				children: [
					{
						path: 'about',
						element: <AboutMe />,
					},
					{
						path: 'contact',
						element: <h1>Contact</h1>,
					},
					{
						path: 'review',
						element: <h1>Reviews</h1>,
					},
					{
						path: 'billing',
						element: <h1>Billing</h1>,
					},
				],
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
