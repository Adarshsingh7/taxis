/** @format */

function JourneyQuote({ quoteOptions }) {
	if (!quoteOptions) return null;

	return (
		<div className='w-full mx-auto p-1 bg-white shadow-lg rounded-lg'>
			<div className='bg-green-600 p-4 rounded-t-lg text-white flex gap-5'>
				<h1 className='text-2xl font-bold'>JOURNEY COST:</h1>
				<p className='text-2xl font-bold'>£{quoteOptions.totalPrice}</p>
			</div>

			<div className='p-4'>
				<div className='mb-2 flex gap-4 items-center'>
					<h2 className='text-md font-medium text-gray-900 flex-shrink-0 w-1/3'>
						CHARGE FROM BASE:
					</h2>
					<p className='text-md font-medium text-gray-700 flex-grow'>
						{quoteOptions.fromBase ? 'Yes' : 'No'}
					</p>
				</div>

				<div className='mb-2 flex gap-4 items-center'>
					<h2 className='text-md font-medium text-gray-900 flex-shrink-0 w-1/3 whitespace-nowrap'>
						JOURNEY TIME:
					</h2>
					<p className='text-md font-semibold text-gray-700 flex-grow'>
						{quoteOptions.durationText}
					</p>
				</div>

				<div className='mb-2 flex gap-4 items-center'>
					<h2 className='text-md font-medium text-gray-900 flex-shrink-0 w-1/3'>
						JOURNEY MILEAGE:
					</h2>
					<p className='text-md font-semibold text-gray-700 flex-grow'>
						{quoteOptions.mileageText}
					</p>
				</div>

				<div className='mb-2 flex gap-4 items-center'>
					<h2 className='text-md font-medium text-gray-900 flex-shrink-0 w-1/3'>
						TARIFF:
					</h2>
					<p className='text-md font-semibold text-gray-700 flex-grow'>
						{quoteOptions.tariff}
					</p>
				</div>
			</div>
		</div>
	);
}

export default JourneyQuote;
