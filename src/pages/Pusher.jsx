/** @format */

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useBooking } from '../hooks/useBooking';
import Booking from './Booking';

export default function Pusher() {
	const { callerTab, insertValue } = useBooking();
	const [value, setValue] = useState(
		callerTab.length === 0 ? 0 : callerTab.length - 1
	);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		setValue(callerTab.length - 1 >= 0 ? callerTab.length - 1 : 0);
	}, [callerTab.length]);

	return (
		<Box
			className='flex justify-between'
			sx={{ width: '100%' }}
		>
			<Box
				sx={{
					margin: '1vh auto',
					// height: '85vh',
					overflow: 'auto',
					width: '50%', // Adjusting the width to 50% for the first child Box
					borderColor: '#e5e7eb',
					borderWidth: '1px',
				}}
			>
				<Tabs
					value={value}
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
									backgroundColor: item.formBusy ? '#B91C1C' : '#e5e7eb',
									color: item.formBusy ? '#ffffff' : '#1976D2',
								}}
							/>
						);
					})}
				</Tabs>

				<Box>
					<Booking
						bookingData={callerTab[value]}
						key={value}
						insertValue={insertValue}
						id={value}
					/>
				</Box>
			</Box>
		</Box>
	);
}
