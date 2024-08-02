/** @format */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Just Displays Information about the Currently Applied Quote
function QuoteDialog({ onSet, quote }) {
	return (
		<div className='flex items-center justify-center w-[20vw] bg-white rounded-lg'>
			<div className='bg-white p-6 rounded-lg max-w-xs w-full px-12'>
				<div className='flex justify-center mb-4'>
					<div className='bg-red-100 rounded-full p-2'>
						<AccountCircleIcon />
					</div>
				</div>
				<div className='text-center mb-4'>
					<h2 className='text-lg font-semibold'>Booking Quote</h2>
				</div>
				<div className='bg-green-700 text-white py-4 px-8 rounded-lg text-center mb-4'>
					<p className='text-2xl font-bold'>£{quote.totalPrice.toFixed(2)}</p>
					<p className='text-sm'>{quote.tariff}</p>
				</div>
				<div className='text-center mb-2'>
					<p className='text-gray-600'>Journey Time</p>
					<p className='text-lg font-semibold'>{quote.totalMileage} Miles</p>
				</div>
				<div className='text-center mb-6'>
					<p className='text-gray-600'>Distance</p>
					<p className='text-lg font-semibold'>
						{Math.floor(quote.totalMinutes / 60)} Hour(s){' '}
						{quote.totalMinutes % 60} Minutes
					</p>
				</div>
				<div className='text-center'>
					<button
						className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600'
						onClick={() => onSet(false)}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default QuoteDialog;
