/** @format */

function EditBookingModal({ setEditBookingModal, data, closeDialog }) {
	console.log(data);
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
					<Button
						variant='contained'
						color='success'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						// onClick={() => handleConfirmClick(driver)}
					>
						Edit All
					</Button>
				) : (
					<Button
						variant='contained'
						color='error'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						// onClick={() => setConfirmAllocation(false)}
					>
						Edit
					</Button>
				)}
			</div>
		</div>
	);
}

export default EditBookingModal;
