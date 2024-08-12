/** @format */

import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllDrivers } from '../../utils/apiReq';
import {
	allocateBookingToDriver,
	selectDriver,
} from '../../context/schedulerSlice';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Modal from '../Modal';
import Loader from '../Loader';
import { useAuth } from '../../hooks/useAuth';

// Allocate Driver Modal Structure
export default function AllocateModal({ setAllocateModal, closeDialog }) {
	const [loading, setLoading] = useState(false);
	const [driverData, setDriverData] = useState([]);
	const [confirmAllocation, setConfirmAllocation] = useState(false);
	const [selectedDriver, setSelectedDriver] = useState(null);
	const dispatch = useDispatch();
	useEffect(() => {
		getAllDrivers().then((res) => {
			setDriverData(res.users.filter((user) => user.roleString !== 'Admin'));
		});
		setLoading(true);
		setLoading(false);
	}, []);

	function handleAttactDriver(driver) {
		setConfirmAllocation(true);
		setSelectedDriver(driver);
		dispatch(selectDriver(driver.id));
	}

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
			<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
				<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
			</div>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium '>Allocate Booking</p>
				</div>
				<div className='bg-[#16A34A] text-center font-medium text-white py-2 px-4 w-full rounded-sm'>
					<p>Gillingham station -- Guys Marsh</p>
				</div>

				<div className='w-full flex justify-center items-center border-b-gray-300 border-b-[1px] p-1'>
					<p>Select Driver</p>
				</div>
				<Modal
					open={confirmAllocation}
					setOpen={setConfirmAllocation}
				>
					<ConfirmAllocationModal
						driver={selectedDriver}
						// bookingData={bookingData}
						setAllocateModal={setAllocateModal}
						closeDialog={closeDialog}
						setConfirmAllocation={setConfirmAllocation}
					/>
				</Modal>
				<div className='m-auto w-full h-[50vh] overflow-auto'>
					{loading ? (
						<Loader />
					) : (
						driverData.map((el, idx) => (
							<>
								<div
									key={idx}
									className='bg-gray-200 flex justify-center w-full items-center mx-auto cursor-pointer gap-4 mb-2'
								>
									<div
										className='w-full mx-auto flex justify-center items-center'
										onClick={() => handleAttactDriver(el)}
									>
										<div
											style={{ backgroundColor: el.colorRGB }}
											className={`h-5 w-5 rounded-full`}
										></div>
										<div className='flex flex-col w-[50%] justify-center items-center'>
											<p className='text-xl'>{el?.fullName}</p>
											<p className='text-[.8rem]'>{el.regNo}</p>
										</div>
									</div>
								</div>
							</>
						))
					)}
				</div>

				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setAllocateModal(false)}
				>
					Back
				</Button>
			</div>
		</div>
	);
}

// Confirm Allocation Modal Structure
function ConfirmAllocationModal({
	setAllocateModal,
	closeDialog,
	driver,
	setConfirmAllocation,
}) {
	const dispatch = useDispatch();
	const user = useAuth();
	const handleConfirmClick = async () => {
		await dispatch(allocateBookingToDriver(user.currentUser.id));
		setConfirmAllocation(false);
		setAllocateModal(false);
		closeDialog();
	};
	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Confirm Driver Allocation</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Are you sure you wish to select {driver.fullName} as the driver?
			</div>
			<div className='w-full flex items-center justify-center gap-4'>
				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setConfirmAllocation(false)}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='success'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => handleConfirmClick(driver)}
				>
					Confirm
				</Button>
			</div>
		</div>
	);
}
