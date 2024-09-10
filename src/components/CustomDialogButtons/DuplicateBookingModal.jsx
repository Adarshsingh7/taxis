/** @format */

import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { Button, Switch } from '@mui/material';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeBooking } from '../../utils/apiReq';
import { openSnackbar } from '../../context/snackbarSlice';
import { getRefreshedBookings } from '../../context/schedulerSlice';
// Duplicate Booking button Modal
export default function DuplicateBookingModal({
	setDuplicateBookingModal,
	closeDialog,
}) {
	const { isActiveTestMode: activeTestMode } = useSelector(
		(state) => state.bookingForm
	);
	const {
		bookings,
		currentlySelectedBookingIndex: index,
		activeSearchResult,
		activeSearch,
	} = useSelector((state) => state.scheduler);
	let data = {};
	data = bookings[index];
	if (activeSearch) data = activeSearchResult;
	const user = useAuth();
	const [isToggleTrue, setToggleTrue] = useState(true);
	const [newDate, setNewDate] = useState(formatDate(new Date()));
	const dispatch = useDispatch();
	const handleToggleChange = () => {
		setToggleTrue(!isToggleTrue);
	};
	const handleDateChange = (e) => {
		setNewDate(e.target.value);
	};
	console.log(user);
	const handleSave = async (data) => {
		console.log(data);
		const newData = {
			...data,
			pickupDateTime: newDate,
		};
		console.log('Duplicate Booking created');
		setDuplicateBookingModal(false);
		closeDialog();
		const res = await makeBooking(newData, activeTestMode);
		if (res.status === 'success') {
			dispatch(getRefreshedBookings());
		}
		if (res.status === 'success') {
			dispatch(openSnackbar('Booking Created Successfully!', 'success'));
		}
	};

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<FileCopyOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Duplicate Booking</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Select a new pickup time for the duplicate booking:
			</div>
			<div className='w-full flex items-center justify-start gap-1'>
				<Switch
					checked={isToggleTrue}
					onChange={handleToggleChange}
				/>
				<span>Use existing booking datetime</span>
			</div>
			{!isToggleTrue && (
				<div className='w-full'>
					<input
						required
						type='datetime-local'
						className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						value={newDate}
						onChange={handleDateChange}
					/>
				</div>
			)}
			<div className='w-full flex items-center justify-center gap-4'>
				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() =>
						handleSave({
							...data,
							bookingId: 0,
							userId: null,
							actionByUserId: user.currentUser.id,
							updatedByName: user.currentUser.fullName,
							status: null,
							bookedByName: user.currentUser.fullName,
							recurrenceID: 0,
							recurrenceRule: '',
						})
					}
				>
					Save
				</Button>
			</div>
		</div>
	);
}
