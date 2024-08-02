/** @format */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// test push

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login';
import AppLayout from './AppLayout';
import Push from './pages/Pusher';
import Protected from './utils/Protected';
import Loader from './components/Loader';
import ErrorPage from './pages/ErrorPage';

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
				loader: Loader,
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
		errorElement: <ErrorPage />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
