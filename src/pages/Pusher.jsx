/** @format */

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useBooking } from '../hooks/useBooking';
import Booking from './Booking';
import DriverAllocation from '../components/DriverAllocation';
import { useState } from 'react';
import Map from '../components/Map';

export default function Pusher() {
	const { data, insertValue, activeTab, onActiveTabChange } = useBooking();
	const [secondaryTab, setSecondaryTab] = useState(1);

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
							<Tab
								label={label}
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
