/** @format */

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useBooking } from '../hooks/useBooking';
import Booking from './Booking';

export default function Pusher() {
	const { callerTab, insertValue, activeTab, onActiveTabChange } = useBooking();

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
					height: '85vh',
					overflow: 'auto',
					width: '50%', // Adjusting the width to 50% for the first child Box
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
					{callerTab.map((item, index) => {
						let label = index === 0 ? 'New Booking' : item.PhoneNumber;
						return (
							<Tab
								label={label}
								key={index}
								style={{
									// backgroundColor: item.formBusy ? '#B91C1C' : '#e5e7eb',
									color: item.formBusy ? '#B91C1C' : '',
								}}
							/>
						);
					})}
				</Tabs>

				<Box>
					<Booking
						bookingData={callerTab[activeTab]}
						key={activeTab}
						insertValue={insertValue}
						id={activeTab}
					/>
				</Box>
			</Box>
		</Box>
	);
}
