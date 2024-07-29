/** @format */
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useBooking } from '../hooks/useBooking';
import Booking from './Booking';
import DriverAllocation from '../components/DriverAllocation';
import { useState } from 'react';
import Map from '../components/Map';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from '../components/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

export default function Pusher() {
	const { data, insertValue, activeTab, onActiveTabChange, deleteBooking } =
		useBooking();
	const [secondaryTab, setSecondaryTab] = useState(1);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

	const handleChange = (event, newValue) => {
		onActiveTabChange(newValue);
	};

	return (
		<Box
			className='flex justify-between'
			sx={{ width: '100%' }}
		>
			<Box
				sx={{
					margin: '1vh auto',
					height: '90vh',
					overflow: 'auto',
					width: '60%', // Adjusting the width to 50% for the first child Box
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
						let label = index === 0 ? 'New Booking' : item.PhoneNumber;
						return (
							<div key={index}>
								<div className='cursor-pointer'>
									<Tab
										label={label}
										key={index}
										style={{
											color: item.formBusy ? '#B91C1C' : '',
										}}
									/>
									{index !== 0 ? (
										<CancelIcon
											fontSize='20px'
											onClick={() => setIsConfirmationModalOpen(true)}
										/>
									) : (
										<></>
									)}
								</div>
								<Modal
									open={isConfirmationModalOpen}
									setOpen={setIsConfirmationModalOpen}
								>
									<ConfirmDeleteBookingModal
										setIsConfirmationModalOpen={setIsConfirmationModalOpen} id={index} deleteBooking={deleteBooking}
									/>
								</Modal>
							</div>
						);
					})}
				</Tabs>
				<Box>
					<Booking
						bookingData={data[activeTab]}
						key={activeTab}
						insertValue={insertValue}
						id={activeTab}
					/>
				</Box>
			</Box>
			<Box
				sx={{
					margin: '1vh auto',
					height: '90vh',
					overflow: 'auto',
					width: '40%',
					borderColor: '#e5e7eb',
					borderWidth: '1px',
				}}
			>
				<Tabs
					value={secondaryTab}
					sx={{ backgroundColor: '#e5e7eb' }}
					onChange={(event, newValue) => setSecondaryTab(newValue)}
					variant='scrollable'
					scrollButtons
					allowScrollButtonsMobile
					aria-label='scrollable force tabs example'
				>
					<Tab label='Availability' />
					<Tab label='Map' />
				</Tabs>
				{secondaryTab === 0 && <DriverAllocation />}
				{secondaryTab === 1 && <Map />}
			</Box>
		</Box>
	);
}

function ConfirmDeleteBookingModal({ setIsConfirmationModalOpen, id, deleteBooking }) {
	const handleClick = (id) => {
        setIsConfirmationModalOpen(false);
        deleteBooking(id);
    };
	return (
		<div className='flex flex-col items-center justify-center w-[20vw] bg-white rounded-lg p-4 gap-4'>
			<div className='flex justify-between items-center  bg-cyan-600 text-white w-full rounded-lg p-2'>
				<h2 className='text-xl font-semibold bg-cyan-600 text-white w-full'>
					Discard Booking
				</h2>
				<CloseIcon onClick={() => setIsConfirmationModalOpen(false)}/>
			</div>
			<h2>Are you sure you want to delete this booking?</h2>
			<div className='flex justify-center items-center gap-2'>
				<Button variant='contained' sx={{backgroundColor: "#0891b2"}}  onClick={() => handleClick(id)}>Yes</Button>
				<Button color='inherit' variant='contained' onClick={() => setIsConfirmationModalOpen(false)}>No</Button>
			</div>
		</div>
	);
}
