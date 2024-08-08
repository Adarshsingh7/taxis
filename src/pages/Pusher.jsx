/** @format */
import { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// import { useBooking } from '../hooks/useBooking';
import Booking from './Booking';
import DriverAllocation from '../components/DriverAllocation';
import { useState } from 'react';
import Map from '../components/Map';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from '../components/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import SimpleSnackbar from '../components/Snackbar-v2';
import FullScreenDialog from '../components/FullScreenModal';
import Scheduler from './Scheduler';
import { useSelector } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import {
	addData,
	endBooking,
	onCreateBooking,
	onUpdateBooking,
	setActiveTabChange,
} from '../context/bookingSlice';

import { useDispatch } from 'react-redux';
import { addCaller } from '../context/callerSlice';
import Pusher from 'pusher-js';
import JourneyQuote from '../components/JourneyQuote';

import { openSnackbar } from '../context/snackbarSlice';
import DriverSection from '../components/DriverSection';

const pusher = new Pusher('8d1879146140a01d73cf', {
	cluster: 'eu',
});

// subscribing to a channel for caller id
const channel = pusher.subscribe('my-channel');

export default function Push() {
	const data = useSelector((state) => state.bookingForm.bookings);
	const activeTab = useSelector(
		(state) => state.bookingForm.activeBookingIndex
	);
	const currentBookingDateTime = data[activeTab].pickupDateTime;
	const dispatch = useDispatch();
	const [secondaryTab, setSecondaryTab] = useState(1);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	// const [viewDispatcher, setViewDispatcher] = useState(false);
	const [isActiveComplete, setIsActiveComplete] = useState(false);
	const [viewScheduler, setViewScheduler] = useState(false);

	const handleChange = (event, newValue) => {
		// onActiveTabChange(newValue);
		dispatch(setActiveTabChange(newValue));
	};

	async function handleBookingUpload(id = activeTab) {
		const currentBooking = data[id];
		try {
			let response;
			if (currentBooking.bookingType === 'Current') {
				response = await dispatch(onUpdateBooking(id));
			} else {
				response = await dispatch(onCreateBooking(id));
			}

			if (response.status === 'success') {
				dispatch(openSnackbar('Booking Updated Successfully', 'success'));
			} else {
				dispatch(openSnackbar('Failed to Update Booking', 'error'));
			}
			return response;
		} catch (error) {
			dispatch(openSnackbar('Failed to process booking', 'error'));
			console.error('Error processing booking:', error);
		}
	}

	useEffect(() => {
		function handleBind(data) {
			try {
				const parsedData = JSON.parse(data.message);
				const PhoneNumber = parsedData.Telephone;
				if (
					parsedData.Current.length === 0 &&
					parsedData.Previous.length === 0
				) {
					dispatch(addData({ PhoneNumber }));
				} else {
					// setCallerId((prev) => [...prev, parsedData]);
					dispatch(addCaller(parsedData));
				}
			} catch (error) {
				console.error('Failed to parse message data:', error);
			}
		}
		channel.bind('my-event', handleBind);
		return () => {
			channel.unbind('my-event', handleBind);
		};
	}, [dispatch]);

	const handleKeyDown = (event) => {
		if (event.key === 'F1') {
			event.preventDefault();
			setViewScheduler((prev) => !prev);
			// setViewDispatcher((prev) => !prev);
		}
		// if (event.key === 'F1') {
		// 	event.preventDefault();
		// 	// setViewDispatcher(false);
		// 	setViewScheduler((prev) => !prev);
		// }
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// all for the slider between componenet
	const [leftWidth, setLeftWidth] = useState(60);

	const handleResize = (event, { size }) => {
		const newWidth = (size.width / window.innerWidth) * 100;
		if (newWidth >= 30 && newWidth <= 70) {
			setLeftWidth(newWidth);
		}
	};

	return (
		<Box
			className='flex'
			sx={{ width: '100%' }}
		>
			{/* <FullScreenDialog
				open={viewScheduler}
				setOpen={setViewScheduler}
				setIsActiveComplete={setIsActiveComplete}
				isActiveComplete={isActiveComplete}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Box
						sx={{ flex: 7, overflow: 'auto', height: '90vh', width: '100vw' }}
					>
						<div className='relative w-full'>
							<Scheduler
								setIsActiveComplete={setIsActiveComplete}
								isActiveComplete={isActiveComplete}
							/>
						</div>
					</Box>
					<Box
						sx={{
							flex: 3,
							padding: '40px 0 0 0',
							overflow: 'auto',
							height: '90vh',
						}}
					>
						<DriverSection />
					</Box>
				</Box>
			</FullScreenDialog> */}
			<Modal
				open={isConfirmationModalOpen}
				setIsOpen={setIsConfirmationModalOpen}
			>
				<ConfirmDeleteBookingModal
					deleteBooking={() => dispatch(endBooking())}
					id={activeTab}
					setIsConfirmationModalOpen={setIsConfirmationModalOpen}
				/>
			</Modal>
			<ResizableBox
				width={(leftWidth / 100) * window.innerWidth}
				height={window.innerHeight * 0.9}
				minConstraints={[window.innerWidth * 0.3, window.innerHeight * 0.9]}
				maxConstraints={[window.innerWidth * 0.7, window.innerHeight * 0.9]}
				axis='x'
				resizeHandles={['e']}
				onResize={handleResize}
				style={{ display: 'flex', overflow: 'hidden' }}
			>
				{/*  box containg the form*/}
				<Box
					sx={{
						margin: '1vh auto',
						height: '90vh',
						overflow: 'auto',
						width: '100%',
						borderColor: '#e5e7eb',
						borderWidth: '1px',
					}}
				>
					<Tabs
						value={activeTab}
						sx={{ backgroundColor: '#e5e7eb' }}
						onChange={handleChange}
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
						aria-label='scrollable force tabs example'
					>
						{data.map((item, index) => {
							let label = index === 0 ? 'New Booking' : item.phoneNumber;
							label +=
								item.bookingType === 'Previous'
									? ' (New)'
									: item.bookingType === 'Current'
									? ' (Edit)'
									: '';
							return (
								<Tab
									label={label}
									icon={
										index !== 0 ? (
											<CancelIcon
												color='error'
												onClick={() => setIsConfirmationModalOpen(true)}
											/>
										) : null
									}
									iconPosition='end'
									key={index}
									style={{
										color: item.formBusy ? '#B91C1C' : '',
									}}
								/>
							);
						})}
					</Tabs>
					<Box>
						<Booking
							bookingData={data[activeTab]}
							key={activeTab}
							id={activeTab}
							onBookingUpload={handleBookingUpload}
						/>
						<SimpleSnackbar />
					</Box>
				</Box>
			</ResizableBox>

			{/* box containing the map and driver avialibility */}
			<Box
				sx={{
					margin: '1vh auto',
					height: '90vh',
					overflow: 'auto',
					width: `${100 - leftWidth}%`,
					borderColor: '#e5e7eb',
					borderWidth: '1px',
				}}
			>
				{/* driver availibility tab */}
				<Tabs
					value={secondaryTab}
					sx={{
						backgroundColor: '#e5e7eb',
						position: 'sticky',
						top: 0,
						zIndex: 10,
					}}
					onChange={(event, newValue) => setSecondaryTab(newValue)}
					variant='scrollable'
					scrollButtons
					allowScrollButtonsMobile
					aria-label='scrollable force tabs example'
				>
					<Tab label='Availability' />
					<Tab label='Map' />
					<Tab label='Scheduler' />
					<Tab label='Messages' />
				</Tabs>
				{secondaryTab === 0 && (
					<DriverAllocation
						currentBookingDateTime={currentBookingDateTime.split(':')[0]}
					/>
				)}
				{secondaryTab === 1 && (
					<>
						<Map />
						<JourneyQuote quoteOptions={data[activeTab].quoteOptions} />
					</>
				)}
				{secondaryTab === 2 && (
					<Scheduler
						setIsActiveComplete={setIsActiveComplete}
						isActiveComplete={isActiveComplete}
						date={currentBookingDateTime.split('T')[0]}
					/>
				)}
				{secondaryTab === 3 && <DriverSection />}
			</Box>
		</Box>
	);
}

function ConfirmDeleteBookingModal({
	setIsConfirmationModalOpen,
	id,
	deleteBooking,
}) {
	const handleClick = () => {
		setIsConfirmationModalOpen(false);
		deleteBooking();
	};
	return (
		<div className='flex flex-col items-center justify-center w-[20vw] bg-white rounded-lg p-4 gap-4'>
			<div className='flex justify-between items-center  bg-cyan-600 text-white w-full rounded-lg p-2'>
				<h2 className='text-xl font-semibold bg-cyan-600 text-white w-full'>
					Discard Booking
				</h2>
				<CloseIcon onClick={() => setIsConfirmationModalOpen(false)} />
			</div>
			<h2>Are you sure you want to delete this booking?</h2>
			<div className='flex justify-center items-center gap-2'>
				<Button
					variant='contained'
					sx={{ backgroundColor: '#0891b2' }}
					onClick={() => handleClick(id)}
				>
					Yes
				</Button>
				<Button
					color='inherit'
					variant='contained'
					onClick={() => setIsConfirmationModalOpen(false)}
				>
					No
				</Button>
			</div>
		</div>
	);
}
