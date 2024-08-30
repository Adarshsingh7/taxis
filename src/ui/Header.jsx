/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Switch } from '@mui/material';
import { useRef, useState } from 'react';

import CallIcon from '@mui/icons-material/Call';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTestMode } from '../context/bookingSlice';
import {
	handleSearchBooking,
	makeSearchInactive,
} from '../context/schedulerSlice';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoImg from '../assets/ace_taxis_v4.svg';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuth, logout } = useAuth();
	const dispatch = useDispatch();
	const activeTestMode = useSelector(
		(state) => state.bookingForm.isActiveTestMode
	);
	const callerId = useSelector((state) => state.caller);
	const [openSearchInput, setOpenSearchInput] = useState(true);
	const [inputData, setInputData] = useState('');
	const inputRef = useRef(null);
	const handleClick = (e) => {
		e.preventDefault();
		setOpenSearchInput(true);
		if (inputData.length < 3) return;
		dispatch(handleSearchBooking(inputData));
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleClick(e);
		}
	};

	return (
		<nav className='sticky top-0 z-50 flex justify-between items-center bg-[#424242] text-white p-4'>
			<span className='flex gap-10'>
				<Link
					to='/pusher'
					className='text-lg font-bold flex justify-center items-center space-x-2 uppercase'
				>
					<img
						src={LogoImg}
						className='flex h-8 w-8'
					/>
					<span>Ace Taxis</span>
				</Link>
			</span>

			<span className='flex gap-10 uppercase text-sm'>
				{!isAuth ? (
					<></>
				) : (
					<div className='flex flex-row items-center align-middle gap-8'>
						{callerId.length > 0 && (
							<Badge
								badgeContent={callerId.length}
								color='error'
								className='cursor-pointer select-none animate-bounce'
							>
								<CallIcon />
							</Badge>
						)}

						<div className='flex justify-center items-center uppercase'>
							<form
								onSubmit={handleClick}
								className='flex justify-center items-center gap-4'
							>
								{openSearchInput && (
									<div className='relative'>
										<input
											ref={inputRef}
											className='rounded-lg w-64 focus:outline-none focus:ring-0 p-1 px-2 text-black bg-gray-200'
											placeholder='Search Bookings...'
											value={inputData}
											onChange={(e) => setInputData(e.target.value)}
											onKeyDown={handleKeyPress}
										/>
										<span className='absolute top-auto right-1 cursor-pointer'>
											<CancelIcon
												onClick={() => {
													dispatch(makeSearchInactive());
													setInputData('');
													setOpenSearchInput(true);
												}}
												fontSize='small'
												color='error'
											/>
										</span>
									</div>
								)}

								<button
									type='submit'
									className='cursor-pointer uppercase text-sm'
								>
									Search
								</button>
							</form>
						</div>
						<span className='flex flex-row gap-2 items-center align-middle'>
							<span>Test Mode</span>
							<Switch
								checked={activeTestMode}
								onChange={(e) => {
									dispatch(setActiveTestMode(e.target.checked));
								}}
							/>
						</span>
						<button
							className='bg-blue-500 text-white px-4 py-2 rounded-lg uppercase text-sm'
							onClick={() => {
								logout();
								navigate('/login');
							}}
						>
							logout
						</button>
					</div>
				)}
			</span>
		</nav>
	);
};

export default Navbar;
