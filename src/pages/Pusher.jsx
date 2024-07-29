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
		<div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
        <h2 className="text-lg font-semibold">Are you absolutely sure, Discard Booking?</h2>
        <p className="text-sm text-gray-600 mt-2">This action cannot be undone. This will permanently delete your booking and remove your data from scope.</p>
        <div className="mt-6 flex justify-end space-x-3">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg" onClick={() => setIsConfirmationModalOpen(false)}>Cancel</button>
            <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={() => handleClick(id)}>Yes</button>
        </div>
    </div>
	);
}
