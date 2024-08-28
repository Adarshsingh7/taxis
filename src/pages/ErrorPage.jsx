/** @format */

import { Button } from '@mui/material';
import { useRouteError } from 'react-router-dom';
import { sendLogs } from '../utils/getLogs';

function ErrorPage() {
	const error = useRouteError();
	sendLogs(error, 'error');
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-background'>
			<img
				className='h-24 w-24 mb-4'
				aria-hidden='true'
				alt='error-icon'
				src='/error.webp'
			/>
			<h1 className='text-3xl text-primary-foreground font-bold mb-2'>
				Oops! An error occurred.
			</h1>
			<p className='text-secondary-foreground mb-4'>
				We're sorry, something went wrong {error.data || error.message}. Please
				try again later.
			</p>
			<Button
				variant='contained'
				color='inherit'
				onClick={() => (window.location.href = '/')}
			>
				Go back to home
			</Button>
		</div>
	);
}

export default ErrorPage;
