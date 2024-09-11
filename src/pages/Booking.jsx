/** @format */
// all External Libraries and Components are imports
import { Switch, TextField } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isValidDate } from '../utils/isValidDate';

// Context And Hooks imports for data flow and management
import {
	removeBooking,
	updateValue,
	updateValueSilentMode,
} from '../context/bookingSlice';
import { useAuth } from './../hooks/useAuth';
import { makeBookingQuoteRequest, fireCallerEvent } from '../utils/apiReq';

// All local component utilitys
import Autocomplete from '../components/AutoComplete';
import Modal from '../components/Modal';
import SimpleSnackbar from '../components/Snackbar-v2';
import GoogleAutoComplete from '../components/GoogleAutoComplete';
import LongButton from '../components/BookingForm/LongButton';

// All Modals and dialogs for the booking form
import RepeatBooking from '../components/BookingForm/RepeatBooking';
import AddAndEditVia from '../components/BookingForm/AddAndEditVia';
import ListDrivers from '../components/BookingForm/ListDrivers';
import QuoteDialog from '../components/BookingForm/QuoteDialog';
import { addCallerToLookup } from '../context/callerSlice';
import { convertKeysToFirstUpper } from '../utils/casingConverter';
import Loader from '../components/Loader';
import { formatDate } from '../utils/formatDate';
import { openSnackbar } from '../context/snackbarSlice';
import { changeActiveDate } from '../context/schedulerSlice';

function Booking({ bookingData, id, onBookingUpload }) {
	// All Hooks and Contexts for the data flow and management
	const { currentUser, isAuth } = useAuth();
	const dispatch = useDispatch();
	const callerId = useSelector((state) => state.caller);

	// All Local States and Hooks for ui and fligs
	const [isAddVIAOpen, setIsAddVIAOpen] = useState(false);
	const [isRepeatBookingModelActive, setIsRepeatBookingModelActive] =
		useState(false);
	const [isDriverModalActive, setDriverModalActive] = useState(false);

	const pickupRef = useRef(null);
	const destinationRef = useRef(null);
	const userNameRef = useRef(null);
	const phoneNumberRef = useRef(null);
	const pickupDateTimeRef = useRef(null);
	const [isQuoteDialogActive, setIsQuoteDialogActive] = useState(false);
	const [quote, setQuote] = useState(null);
	const [formSubmitLoading, setFormSubmitLoading] = useState(false);

	// working for 🔁 button basically toggles between pickup and destination addresses
	function toggleAddress() {
		updateData('destinationAddress', bookingData.pickupAddress);
		updateData('destinationPostCode', bookingData.pickupPostCode);
		updateData('pickupAddress', bookingData.destinationAddress);
		updateData('pickupPostCode', bookingData.destinationPostCode);
	}

	// Submit the form data to the Puser Component
	async function handleSubmit(e) {
		e.preventDefault();

		if (bookingData.returnDateTime) {
			const pickup = new Date(bookingData.pickupDateTime).getTime();
			const returnTime = new Date(bookingData.returnDateTime).getTime();

			if (returnTime < pickup) {
				dispatch(openSnackbar('Return time must be after pickup', 'error'));
				pickupDateTimeRef.current.focus();
				pickupDateTimeRef.current.select();
				return;
			}
		}

		// const { hours, minutes } = bookingData;
		const hours = Number(bookingData.hours);
		const minutes = Number(bookingData.minutes);

		if (
			hours < 0 ||
			hours > 100 ||
			isNaN(hours) ||
			minutes < 0 ||
			minutes > 59 ||
			isNaN(minutes)
		) {
			dispatch(openSnackbar('Invalid duration range', 'error'));
			return;
		}

		updateData('durationMinutes', hours * 60 + minutes);

		setFormSubmitLoading(true);
		await onBookingUpload(id);
		setFormSubmitLoading(false);
	}

	// Abstract way to call the updateValue redux function setting the ID
	function updateData(property, val) {
		dispatch(updateValue(id, property, val));
	}

	// This Function sets the pickup address and postcode by location data used in autocomplete
	function handleAddPickup(location) {
		updateData('pickupAddress', location.address);
		updateData('pickupPostCode', location.postcode);
	}

	// This Function sets the destination address and postcode by location data used in autocomplete
	function handleAddDestination(location) {
		updateData('destinationAddress', location.address);
		updateData('destinationPostCode', location.postcode);
	}

	// This Function adds the driver to the booking form
	function addDriverToBooking(driverId) {
		setDriverModalActive(false);
		updateData('userId', driverId);
	}

	// This Function gets the quote and set the value to the booking form
	async function findQuote() {
		const quote = await makeBookingQuoteRequest({
			pickupPostcode: bookingData.pickupPostCode,
			viaPostcodes: bookingData.vias.map((via) => via.postCode),
			destinationPostcode: bookingData.destinationPostCode,
			pickupDateTime: bookingData.pickupDateTime,
			passengers: bookingData.passengers,
			priceFromBase: bookingData.chargeFromBase,
		});
		if (quote.status === 'success') {
			updateData('price', +quote.totalPrice);
			updateData('durationText', String(quote.totalMinutes));
			updateData('quoteOptions', quote);
			setIsQuoteDialogActive(true);
			setQuote(quote);
		} else {
			setQuote(null);
			dispatch(openSnackbar('Failed to get quote', 'error'));
		}
	}

	// This Function cancels the booking form
	function deleteForm() {
		dispatch(removeBooking(id));
	}

	async function handleFireCallerEvent() {
		const data = await fireCallerEvent(bookingData.phoneNumber);
		if (data.status === 'success') {
			if (data.current.length || data.previous.length) {
				dispatch(addCallerToLookup(convertKeysToFirstUpper(data)));
				pickupRef.current.focus();
				pickupRef.current.select();
			} else {
				dispatch(openSnackbar('No caller found', 'info'));
			}
		}
	}

	function handleChangeFocus(event, ref) {
		if (event.key === 'Enter') {
			ref.current.focus();
			ref.current.select();
		}
	}

	function handleClick(event, ref) {
		ref.current.focus();
		ref.current.select();
	}

	// auto calculate the quotes based on Pickup and destination
	useEffect(() => {
		if (
			!bookingData.pickupPostCode ||
			(!bookingData.destinationPostCode && bookingData.vias.length === 0) ||
			bookingData.scope !== 0
		)
			return;

		if (!bookingData.formBusy) return;
		makeBookingQuoteRequest({
			pickupPostcode: bookingData.pickupPostCode,
			viaPostcodes: bookingData.vias.map((via) => via.postCode),
			destinationPostcode: bookingData.destinationPostCode,
			pickupDateTime: bookingData.pickupDateTime,
			passengers: bookingData.passengers,
			priceFromBase: bookingData.chargeFromBase,
		}).then((quote) => {
			if (quote.status === 'success') {
				dispatch(updateValueSilentMode(id, 'price', +quote.totalPrice));
				dispatch(updateValueSilentMode(id, 'quoteOptions', quote));
				dispatch(
					updateValueSilentMode(id, 'durationText', String(quote.totalMinutes))
				);
				dispatch(
					updateValueSilentMode(
						id,
						'hours',
						Math.floor(quote.totalMinutes / 60)
					)
				);
				dispatch(updateValueSilentMode(id, 'minutes', quote.totalMinutes % 60));
			} else {
				// setQuote(null);
				updateData('price', '');
				dispatch(openSnackbar('Failed to get quote', 'error'));
			}
		});
	}, [
		bookingData.pickupPostCode,
		bookingData.destinationPostCode,
		bookingData.postcode,
		bookingData.chargeFromBase,
		bookingData.vias,
		bookingData.pickupDateTime,
		bookingData.passengers,
		bookingData.scope,
		dispatch,
		id,
	]);

	// This Function sets the END key functionality
	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === 'End') {
				document.getElementById('myForm').requestSubmit();
			}
			if (event.key === 'Enter') event.preventDefault();
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	// This Function sets the user name to the booking form
	useEffect(() => {
		if (!isAuth) return;
		if (currentUser && !currentUser.fullName) return;
		if (bookingData.bookingType === 'current') {
			dispatch(
				updateValueSilentMode(id, 'updatedByName', currentUser.fullName)
			);
		} else {
			dispatch(updateValueSilentMode(id, 'bookedByName', currentUser.fullName));
		}
	}, [isAuth, currentUser, bookingData.bookingType, dispatch, id]);

	// Set the snackbar for caller event
	useEffect(() => {
		if (callerId.length > 0 && bookingData.formBusy) {
			dispatch(openSnackbar(`${callerId.length} Caller Waiting`, 'error'));
		}
	}, [callerId.length, bookingData.formBusy, dispatch]);

	// Focus on the input field based on the booking type
	useEffect(() => {
		if (bookingData.formBusy) return;
		if (bookingData.bookingType === 'previous') {
			destinationRef.current.focus();
			destinationRef.current.select();
		} else {
			pickupRef.current.focus();
			pickupRef.current.select();
		}
	}, [
		bookingData.pickupAddress,
		bookingData.bookingType,
		bookingData.formBusy,
	]);

	// update the time of the form if form is not busy every 30 sec
	useEffect(() => {
		function updateToCurrentTime() {
			if (bookingData.formBusy) {
				clearInterval(updateTimeInterval);
				return;
			}
			dispatch(
				updateValueSilentMode(id, 'pickupDateTime', formatDate(new Date()))
			);
		}
		if (bookingData.bookingType === 'Current') return;
		const updateTimeInterval = setInterval(updateToCurrentTime, 1000);
		return () => clearInterval(updateTimeInterval);
	}, [dispatch, id, bookingData.formBusy, bookingData.bookingType]);

	useEffect(() => {
		function getDateWithZeroTime(input) {
			const date = new Date(input);

			// Set hours, minutes, seconds, and milliseconds to 00
			date.setHours(0, 0, 0, 0);

			return date;
		}
		if (bookingData.pickupDateTime) {
			const date = new Date(
				getDateWithZeroTime(bookingData.pickupDateTime)
			).toISOString();
			if (bookingData.formBusy) {
				dispatch(changeActiveDate(date));
			}
		}
	}, [bookingData.formBusy, bookingData.pickupDateTime, dispatch]);

	useEffect(() => {
		if (bookingData.formBusy) return;
		dispatch(
			updateValueSilentMode(
				id,
				'hours',
				Math.floor(bookingData.durationMinutes / 60)
			)
		);
		dispatch(
			updateValueSilentMode(
				id,
				'minutes',
				Math.floor(bookingData.durationMinutes % 60)
			)
		);
	}, [bookingData.durationMinutes, id, dispatch, bookingData.formBusy]);

	function convertToOneHourLaterFromPickUp() {
		const pickupDateTime = new Date(bookingData.pickupDateTime);
		const oneHourLater = new Date(
			pickupDateTime.getTime() + 1 * 60 * 60 * 1000
		);
		return formatDate(oneHourLater);
	}

	if (!bookingData) return null;

	return (
		<div className='bg-background text-foreground p-3 m-auto'>
			<form
				autoComplete='off'
				id='myForm'
				action=''
				onSubmit={handleSubmit}
			>
				<>
					{formSubmitLoading && <Loader />}
					<Modal
						open={isRepeatBookingModelActive}
						setOpen={setIsRepeatBookingModelActive}
					>
						<RepeatBooking onSet={setIsRepeatBookingModelActive} />
					</Modal>
					<Modal
						open={isDriverModalActive}
						setOpen={setDriverModalActive}
					>
						<ListDrivers
							onSet={addDriverToBooking}
							setOpen={setDriverModalActive}
						/>
					</Modal>
					<Modal
						open={isAddVIAOpen}
						setOpen={setIsAddVIAOpen}
					>
						<AddAndEditVia onSet={setIsAddVIAOpen} />
					</Modal>
					<Modal
						open={isQuoteDialogActive}
						setOpen={setIsQuoteDialogActive}
					>
						<QuoteDialog
							onSet={setIsQuoteDialogActive}
							id={id}
							quote={quote}
						/>
					</Modal>
					<SimpleSnackbar />
				</>
				<div className='max-w-3xl mx-auto bg-card pb-4 px-4 rounded-lg shadow-lg'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex gap-5 flex-col md:flex-row'>
							<input
								required
								type='datetime-local'
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								value={bookingData.pickupDateTime}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										pickupRef.current.focus();
										pickupRef.current.select();
									}
								}}
								onChange={(e) => {
									if (!isValidDate(e.target.value)) return;
									updateData('pickupDateTime', e.target.value);
									return e.target.value;
								}}
							/>

							{bookingData.returnBooking ? (
								<input
									disabled={bookingData.returnBooking ? false : true}
									required
									type='datetime-local'
									value={bookingData.returnDateTime}
									onChange={(e) => updateData('returnDateTime', e.target.value)}
									ref={pickupDateTimeRef}
									className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								/>
							) : null}
						</div>
						<div className='flex gap-5 flex-col md:flex-row justify-between items-center align-middle'>
							<div className='bg-red-700 hover:bg-opacity-80 rounded-lg flex  text-white'>
								<button
									type='button'
									className='px-3 py-2'
									onClick={() => setIsRepeatBookingModelActive(true)}
								>
									Repeat Booking
								</button>
							</div>
							<div>
								<span className='mr-2'>Return</span>
								<Switch
									color='error'
									checked={bookingData.returnBooking}
									onClick={() => {
										!bookingData.returnBooking
											? updateData(
													'returnDateTime',
													convertToOneHourLaterFromPickUp()
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  )
											: null;
										updateData('returnBooking', !bookingData.returnBooking);
									}}
								/>
							</div>
							<></>
						</div>
					</div>
					{/* Google AutoSuggestion 1 */}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
						<GoogleAutoComplete
							placeholder='Pickup Address'
							value={bookingData.pickupAddress}
							onPushChange={handleAddPickup}
							onChange={(e) => {
								const addressValue = e.target.value;
								updateData('pickupAddress', addressValue);

								// Clear pickupPostCode if pickupAddress is empty
								if (!addressValue) {
									updateData('pickupPostCode', '');
								}
							}}
							inputRef={pickupRef}
							handleChangeRef={(e) => handleChangeFocus(e, destinationRef)}
							handleClickRef={(e) => handleClick(e, pickupRef)}
						/>
						<Autocomplete
							type='postal'
							required={false}
							placeholder='Post Code'
							value={bookingData.pickupPostCode}
							onPushChange={handleAddPickup}
							onChange={(e) => updateData('pickupPostCode', e.target.value)}
						/>
					</div>
					{/* Toogle Button Start*/}
					<div className='flex justify-center mb-2'>
						<button
							type='button'
							onClick={toggleAddress}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								aria-hidden='true'
								className='h-6 w-6 text-red-600 mx-auto'
							>
								<path
									fillRule='evenodd'
									d='M6.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.25 4.81V16.5a.75.75 0 01-1.5 0V4.81L3.53 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zm9.53 4.28a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V7.5a.75.75 0 01.75-.75z'
									clipRule='evenodd'
								></path>
							</svg>
						</button>
					</div>
					{/* Toogle Button Ends */}

					{/* Google AutoSuggestion 2 */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
						<GoogleAutoComplete
							placeholder='Destination Address'
							value={bookingData.destinationAddress}
							onPushChange={handleAddDestination}
							onChange={(e) => {
								const addressValue = e.target.value;
								updateData('destinationAddress', addressValue);

								if (!addressValue) {
									updateData('destinationPostCode', '');
								}
							}}
							inputRef={destinationRef}
							handleChangeRef={(e) => handleChangeFocus(e, userNameRef)}
							handleClickRef={(e) => handleClick(e, destinationRef)}
						/>
						<Autocomplete
							required={false}
							type='postal'
							placeholder='Post Code'
							value={bookingData.destinationPostCode}
							onPushChange={handleAddDestination}
							onChange={(e) =>
								updateData('destinationPostCode', e.target.value)
							}
						/>
					</div>

					<div className='mb-2'>
						<textarea
							placeholder='Booking Details'
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							value={bookingData.details}
							onChange={(e) => updateData('details', e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									const newValue = bookingData.details + '\n';
									updateData('details', newValue);
								}
							}}
						></textarea>
					</div>

					<div className='mb-4'>
						<LongButton onClick={() => setIsAddVIAOpen(true)}>
							Add VIA
						</LongButton>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-4 place-content-center gap-4 mb-4 '>
						<div className='flex items-center gap-2'>
							{/* <span>£</span> */}
							<Input
								type='number'
								required={true}
								placeholder='Driver Price (£)'
								value={bookingData.price}
								onChange={(e) =>
									updateData(
										'price',
										(() => {
											const value = parseFloat(e.target.value);
											if (e.target.value === '') return '';
											if (
												(!isNaN(value) && value >= 0) ||
												e.target.value === ''
											) {
												return value;
											} else return bookingData.price;
										})()
									)
								}
							/>
						</div>

						<div className='flex items-center justify-center'>
							<label className='mr-2'>Passengers</label>
							<select
								value={bookingData.passengers}
								onChange={(e) => updateData('passengers', e.target.value)}
								className='min-w-[45%] bg-input text-foreground p-2 rounded-lg border border-border'
							>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
								<option value={6}>6</option>
								<option value={7}>7</option>
								<option value={8}>8</option>
								<option value={9}>9</option>
							</select>
						</div>
						{/* <label className='flex items-center'>
							<span className='mr-2'>Charge From Base</span>
							<Switch
								color='error'
								checked={bookingData.chargeFromBase}
								onChange={() =>
									updateData('chargeFromBase', !bookingData.chargeFromBase)
								}
							/>
						</label> */}

						<div className='flex items-center justify-center'>
							<span className='mr-2 select-none'>All Day</span>
							<input
								type='checkbox'
								checked={bookingData.isAllDay}
								onChange={(e) => updateData('isAllDay', e.target.checked)}
								className='form-checkbox h-5 w-5 text-primary'
							/>
						</div>
						<div className='flex justify-center items-center'>
							{bookingData.scope !== 1 && (
								<>
									{bookingData.price ? (
										<LongButton onClick={() => updateData('price', '')}>
											Reset Price
										</LongButton>
									) : (
										<LongButton onClick={findQuote}>Get Quote</LongButton>
									)}
								</>
							)}
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
						<Input
							required
							type='text'
							placeholder='Name'
							value={bookingData.passengerName}
							inputRef={userNameRef}
							onChange={(e) => updateData('passengerName', e.target.value)}
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						/>
						{/* Hours Duration Section Details */}
						<div className='flex items-center'>
							<Input
								type='number'
								placeholder='Hours'
								required
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								value={bookingData.hours}
								onChange={(e) => updateData('hours', e.target.value)}
							/>
							<Input
								type='number'
								required
								placeholder='Minutes'
								value={bookingData.minutes}
								onChange={(e) => updateData('minutes', e.target.value)}
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
						<Input
							type='email'
							placeholder='Email'
							value={bookingData.email}
							onChange={(e) => updateData('email', e.target.value)}
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						/>
						<div className='flex justify-between flex-row items-center gap-1'>
							<Input
								type='text'
								placeholder='Phone'
								value={bookingData.phoneNumber}
								inputRef={phoneNumberRef}
								onChange={(e) => {
									const value = e.target.value;
									// Remove non-numeric characters and limit to 12 digits
									const cleanedValue = value.replace(/\D/g, '').slice(0, 12);
									updateData('phoneNumber', cleanedValue);
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleFireCallerEvent();
									}
								}}
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							/>
							<div
								className='px-3 bg-red-700 hover:bg-opacity-80 rounded-lg flex cursor-pointer'
								onClick={() => handleFireCallerEvent()}
							>
								<span
									style={{ padding: '1rem 0' }}
									color='error'
									className='text-white flex gap-2 px-3'
									type='button'
								>
									<LocalPhoneIcon />
									<span>Lookup</span>
								</span>
							</div>
						</div>
					</div>

					{currentUser?.isAdmin ? (
						<>
							{/* <p>options</p> */}
							<div className='options mb-2 flex justify-between gap-3 align-middle items-center'>
								<p className='text-gray-700 text-sm'>status:</p>
								<select
									name='status'
									onChange={(e) => updateData('paymentStatus', +e.target.value)}
									id='options'
									value={bookingData.paymentStatus}
									className='block w-[75%] mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								>
									<option value={0}>None</option>
									<option value={2}>Paid</option>
									<option value={3}>Awaiting payment</option>
								</select>
								<p className='text-gray-700 text-sm'>scope:</p>
								<select
									name='scope'
									id='options'
									value={bookingData.scope}
									onChange={(e) => updateData('scope', +e.target.value)}
									className='block w-[75%] mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								>
									<option value={0}>Cash</option>
									<option value={1}>Account</option>
									<option value={2}>Rank</option>
									<option value={3}>All</option>
								</select>
							</div>
							{bookingData.scope === 1 ? (
								<div className='flex justify-between items-center'>
									<div className='flex justify-between items-center w-[48%]'>
										<p className='text-gray-700 text-sm capitalize'>
											Account number:
										</p>
										<select
											name='account'
											id='account'
											value={bookingData.accountNumber}
											onChange={(e) =>
												updateData('accountNumber', +e.target.value)
											}
											className=' block w-[65%] mt-1 py-2 px-0 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										>
											{JSON.parse(localStorage.getItem('accounts')).map(
												(el, i) => (
													<Fragment key={i}>
														{el.accountName && (
															<option value={el.accNo}>
																{el.accNo === 0
																	? 'select'
																	: `${el.accNo}-${el.accountName}`}
															</option>
														)}
													</Fragment>
												)
											)}
										</select>
									</div>

									<div className='mb-2 w-[50%] flex flex-col gap-4'>
										{bookingData.scope === 1 ? (
											<Input
												type='number'
												placeholder='Price Account'
												value={bookingData.priceAccount}
												onChange={(e) => {
													const newValue = parseFloat(e.target.value);
													if (e.target.value === '')
														return updateData('priceAccount', '');
													if (!isNaN(newValue) && newValue >= 0) {
														return updateData('priceAccount', +e.target.value);
													}
												}}
												className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
											/>
										) : null}
									</div>
								</div>
							) : null}
						</>
					) : null}

					<div className='flex justify-between gap-5 mb-2'>
						<LongButton onClick={() => setDriverModalActive(true)}>
							Allocate Driver
						</LongButton>
					</div>

					<div className='flex justify-end space-x-4'>
						<button
							onClick={deleteForm}
							className='bg-muted text-muted-foreground px-4 py-2 rounded-lg bg-gray-100'
							type='button'
						>
							Cancel
						</button>
						<button
							className='bg-primary text-primary-foreground px-4 py-2 rounded-lg text-white bg-gray-900'
							type='submit'
						>
							{bookingData.bookingType === 'Current' ? 'Update' : 'Create'}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

// Via Section Modal

function Input({ value, onChange, type, placeholder, required, ...props }) {
	return (
		<TextField
			autoComplete='new-password'
			required={required}
			type={type}
			value={value}
			onChange={onChange}
			id={String(Math.random() * 10000)}
			label={placeholder}
			{...props}
		/>
	);
}

export default Booking;
