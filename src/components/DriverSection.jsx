/** @format */

const DriverAllocationMessageStatus = () => {
	return (
		<div className='flex flex-col just'>
			<div className='bg-gray-100  p-4'>
				<div className='max-w-5xl mx-auto'>
					<div className='bg-white shadow-md rounded-lg overflow-hidden'>
						<div className='flex justify-between items-center bg-gray-800 text-white p-4'>
							<h2 className='text-lg font-semibold'>User Message Status</h2>
							<button className='bg-red-500 hover:bg-red-600 p-2 rounded-full'>
								<svg
									className='w-6 h-6'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M10 18l6-6-6-6v12z'></path>
								</svg>
							</button>
						</div>
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white'>
								<thead className='bg-gray-200 text-gray-600'>
									<tr>
										<th className='py-3 px-4 text-left'>Sent At</th>
										<th className='py-3 px-4 text-left'>Job #</th>
										<th className='py-3 px-4 text-left'>Pickup</th>
										<th className='py-3 px-4 text-left'>Passenger</th>
										<th className='py-3 px-4 text-left'>Pending</th>
										<th className='py-3 px-4'></th>
									</tr>
								</thead>
								<tbody>
									<tr className='bg-yellow-100 border-b border-gray-200'>
										<td className='py-3 px-4'>00:00:00</td>
										<td className='py-3 px-4'>00000</td>
										<td className='py-3 px-4'>Lorem ipsum.</td>
										<td className='py-3 px-4'>John</td>
										<td className='py-3 px-4'>SENT</td>
										<td className='py-3 px-4 text-right'>
											<button className='text-red-500 hover:text-red-700'>
												<svg
													className='w-6 h-6'
													fill='currentColor'
													viewBox='0 0 24 24'
												>
													<path d='M15 9h-3V6h-4v3H5v4h3v3h4v-3h3V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'></path>
												</svg>
											</button>
										</td>
									</tr>
									<tr className='bg-yellow-100 border-b border-gray-200'>
										<td className='py-3 px-4'>00:00:00</td>
										<td className='py-3 px-4'>00000</td>
										<td className='py-3 px-4'>Lorem ipsum.</td>
										<td className='py-3 px-4'>John</td>
										<td className='py-3 px-4'>SENT</td>
										<td className='py-3 px-4 text-right'>
											<button className='text-red-500 hover:text-red-700'>
												<svg
													className='w-6 h-6'
													fill='currentColor'
													viewBox='0 0 24 24'
												>
													<path d='M15 9h-3V6h-4v3H5v4h3v3h4v-3h3V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'></path>
												</svg>
											</button>
										</td>
									</tr>
									<tr className='bg-yellow-100 border-b border-gray-200'>
										<td className='py-3 px-4'>00:00:00</td>
										<td className='py-3 px-4'>00000</td>
										<td className='py-3 px-4'>Lorem ipsum.</td>
										<td className='py-3 px-4'>John</td>
										<td className='py-3 px-4'>SENT</td>
										<td className='py-3 px-4 text-right'>
											<button className='text-red-500 hover:text-red-700'>
												<svg
													className='w-6 h-6'
													fill='currentColor'
													viewBox='0 0 24 24'
												>
													<path d='M15 9h-3V6h-4v3H5v4h3v3h4v-3h3V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'></path>
												</svg>
											</button>
										</td>
									</tr>
									<tr className='bg-yellow-100 border-b border-gray-200'>
										<td className='py-3 px-4'>00:00:00</td>
										<td className='py-3 px-4'>00000</td>
										<td className='py-3 px-4'>Lorem ipsum.</td>
										<td className='py-3 px-4'>John</td>
										<td className='py-3 px-4'>SENT</td>
										<td className='py-3 px-4 text-right'>
											<button className='text-red-500 hover:text-red-700'>
												<svg
													className='w-6 h-6'
													fill='currentColor'
													viewBox='0 0 24 24'
												>
													<path d='M15 9h-3V6h-4v3H5v4h3v3h4v-3h3V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'></path>
												</svg>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div className='bg-gray-100  p-4'>
				<div className='max-w-5xl mx-auto'>
					<div className='bg-white shadow-md rounded-lg overflow-hidden'>
						<div className='flex justify-between items-center bg-gray-800 text-white p-4'>
							<h2 className='text-lg font-semibold'>Driver Allocation</h2>
							<button className='bg-red-500 hover:bg-red-600 p-2 rounded-full'>
								<svg
									className='w-6 h-6'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M10 18l6-6-6-6v12z'></path>
								</svg>
							</button>
						</div>
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white'>
								<thead className='bg-gray-200 text-gray-600'>
									<tr>
										<th className='py-3 px-4 text-left'>Sent At</th>
										<th className='py-3 px-4 text-left'>Job #</th>
										<th className='py-3 px-4 text-left'>Pickup</th>
										<th className='py-3 px-4 text-left'>Passenger</th>
										<th className='py-3 px-4 text-left'>Pending</th>
										<th className='py-3 px-4'></th>
									</tr>
								</thead>
								<tbody>
									<tr className='bg-yellow-100 border-b border-gray-200'>
										<td className='py-3 px-4'>00:00:00</td>
										<td className='py-3 px-4'>00000</td>
										<td className='py-3 px-4'>Lorem ipsum.</td>
										<td className='py-3 px-4'>John</td>
										<td className='py-3 px-4'>SENT</td>
										<td className='py-3 px-4 text-right'>
											<button className='text-red-500 hover:text-red-700'>
												<svg
													className='w-6 h-6'
													fill='currentColor'
													viewBox='0 0 24 24'
												>
													<path d='M15 9h-3V6h-4v3H5v4h3v3h4v-3h3V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'></path>
												</svg>
											</button>
										</td>
									</tr>
									<tr className='bg-yellow-100 border-b border-gray-200'>
										<td className='py-3 px-4'>00:00:00</td>
										<td className='py-3 px-4'>00000</td>
										<td className='py-3 px-4'>Lorem ipsum.</td>
										<td className='py-3 px-4'>John</td>
										<td className='py-3 px-4'>SENT</td>
										<td className='py-3 px-4 text-right'>
											<button className='text-red-500 hover:text-red-700'>
												<svg
													className='w-6 h-6'
													fill='currentColor'
													viewBox='0 0 24 24'
												>
													<path d='M15 9h-3V6h-4v3H5v4h3v3h4v-3h3V9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'></path>
												</svg>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DriverAllocationMessageStatus;
