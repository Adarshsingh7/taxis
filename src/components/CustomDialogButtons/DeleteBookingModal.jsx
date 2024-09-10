/** @format */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSchedulerBooking } from '../../context/schedulerSlice';
import { useAuth } from '../../hooks/useAuth';

// Delete Booking Modal Structure

export default function DeleteBookingModal({ setDeleteModal, closeDialog }) {
	const dispatch = useDispatch();
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
	const handleSingleDelete = () => {
		dispatch(
			deleteSchedulerBooking(
				false,
				user.currentUser.fullName,
				user.currentUser.id
			)
		);
		setDeleteModal(false);
		closeDialog();
	};

	const handleDeleteAllRepeat = async () => {
		dispatch(
			deleteSchedulerBooking(
				true,
				user.currentUser.fullName,
				user.currentUser.id
			)
		);
		setDeleteModal(false);
		closeDialog();
	};

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<DeleteOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Delete Your Bookings</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Are you sure you wish to delete the selected booking?
			</div>
			<div className='w-full flex items-center justify-center gap-4'>
				{data.recurrenceID && data.recurrenceRule ? (
					<>
						<Button
							variant='contained'
							color='error'
							sx={{ paddingY: '0.5rem', marginTop: '4px' }}
							className='w-full cursor-pointer'
							onClick={handleSingleDelete}
						>
							Delete
						</Button>
						<Button
							variant='contained'
							color='error'
							sx={{ paddingY: '0.5rem', marginTop: '4px' }}
							className='w-full cursor-pointer'
							onClick={handleDeleteAllRepeat}
						>
							Delete All
						</Button>
					</>
				) : (
					<Button
						variant='contained'
						color='error'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						onClick={handleSingleDelete}
					>
						Delete
					</Button>
				)}
			</div>
		</div>
	);
}
