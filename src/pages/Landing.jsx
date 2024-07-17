/** @format */

import { Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Shared Tailwind CSS classes
const primaryBgClass = 'bg-primary';
const primaryTextClass = 'text-gray-800';
const secondaryBgClass = 'bg-secondary';
const secondaryTextClass = 'text-gray-700';

const MainContent = () => {
	const [count, setCount] = useState(0);

	return (
		<div
			className={`min-h-screen flex flex-col items-center justify-center ${primaryBgClass} linear-gradient(to right, #fffcdc, #d9a7c7) p-10 ${primaryTextClass}`}
		>
			<div className='flex justify-between w-full max-w-6xl items-center mb-10'>
				<div className='flex items-center space-x-5'>
					<img
						src='/logo.svg'
						alt='logo'
						className='w-10 h-10'
					/>
					<span className='text-3xl font-bold tracking-tight'>Ace Taxis </span>
				</div>
			</div>
			<div className='flex flex-col lg:flex-row w-full max-w-6xl items-center space-y-10 lg:space-y-0 lg:space-x-20'>
				<div className='lg:w-1/2 text-center lg:text-left space-y-5'>
					<p className='text-xl'>Ultimate</p>
					<h1 className='text-5xl font-extrabold'>way to</h1>
					<p className='text-2xl'>Connect with clients & drivers</p>
					<div className='flex justify-center lg:justify-start space-x-5 mt-5'>
						<Link to='/app'>
							<Button
								variant='contained'
								color='error'
								className={` ${secondaryBgClass} ${secondaryTextClass} py-2 px-4 rounded-lg`}
								onClick={() => setCount(count + 1)}
							>
								Get Started Now
							</Button>
						</Link>
						<Link to='/pusher'>
							<button
								className={` ${secondaryTextClass} border ${secondaryBgClass} py-2 px-4 rounded-lg flex items-center space-x-2`}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm2-9V7l3 3-3 3V9h2zm-4 0v2H6V9h2zm12 0h-6v2h6V9z'
										clipRule='evenodd'
									/>
								</svg>
								Book Taxis
							</button>
						</Link>
					</div>
				</div>
				<div className='lg:w-1/2'>
					<img
						src='/example.png'
						alt='template preview'
						className='rounded-lg shadow-lg'
					/>
				</div>
			</div>
		</div>
	);
};

const Landing = () => {
	return (
		<>
			<MainContent />
		</>
	);
};

export default Landing;
