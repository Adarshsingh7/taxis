/** @format */
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addDataFromSchedulerInEditMode } from '../../context/bookingSlice';

function EditBookingModal({ setEditBookingModal, closeDialog }) {
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
	function handleEditOne() {
		const filterData = {
			...data,
			recurrenceID: '',
			recurrenceRule: '',
		};
		dispatch(addDataFromSchedulerInEditMode(filterData));
		closeDialog(false);
		setEditBookingModal(false);
	}
	function handleEditAll() {
		console.log('Handle edit all booking Data', data);
		dispatch(addDataFromSchedulerInEditMode({ ...data }));
		closeDialog(false);
		setEditBookingModal(false);
	}
	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Edit Your Bookings</p>
				</div>
			</div>

			<div className='w-full flex items-center justify-center gap-4'>
				{data.recurrenceID && data.recurrenceRule ? (
					<>
						<Button
							variant='contained'
							color='error'
							sx={{ paddingY: '0.5rem', marginTop: '4px' }}
							className='w-full cursor-pointer'
							onClick={handleEditOne}
						>
							Edit
						</Button>
						<Button
							variant='contained'
							color='success'
							sx={{ paddingY: '0.5rem', marginTop: '4px' }}
							className='w-full cursor-pointer'
							onClick={handleEditAll}
						>
							Edit All
						</Button>
					</>
				) : (
					{
						/* <Button
						variant='contained'
						color='error'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						onClick={handleEditOne}
					>
						Edit
					</Button> */
					}
				)}
			</div>
		</div>
	);
}

export default EditBookingModal;
