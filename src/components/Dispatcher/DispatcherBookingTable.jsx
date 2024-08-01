export default function DispatcherBookingTable({ bookings }) {
	// console.log(bookings);
	const rows = [
		'Type',
		'Date',
        'Time',
		'Pickup Address',
		'Destination Address',
		'Name',
		'Price',
	];

    function isLightColor(hex) {
		// Remove the leading # if present
		hex = hex.replace(/^#/, '');

		// Parse the hex color
		let r = parseInt(hex.substring(0, 2), 16);
		let g = parseInt(hex.substring(2, 4), 16);
		let b = parseInt(hex.substring(4, 6), 16);

		// Calculate the relative luminance
		let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

		// Determine if the color is light
		return luminance > 0.5;
	}

	return (
		<table className='min-w-full table-auto'>
			<thead className='bg-black text-white relative'>
				<tr className=''>
					{rows.map((row, i) => (
						<th key={i} className='py-4 sticky top-0 bg-[#424242] z-10'>{row}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{/* Bookings */}
				{bookings.map((booking, i) => (
					<tr
						key={i}
                        style={{backgroundColor: booking.backgroundColorRGB, color: isLightColor(booking.backgroundColorRGB) ? "black" : "white"}}
						className="font-medium"
					>
                        <td className='border px-4 py-2'>C</td>
                        <td className='border px-4 py-2'>{booking.pickupDateTime.split("T")[0]}</td>
						<td className='border px-4 py-2 whitespace-nowrap'>
							{booking.pickupDateTime.split("T")[1]}
						</td>
						<td className='border px-4 py-2'>{booking.pickupAddress},{booking.pickupPostCode}</td>
						<td className='border px-4 py-2'>{booking.destinationAddress},{booking.destinationPostCode}</td>
						<td className='border px-4 py-2'>{booking.passengerName}</td>
						<td className='border px-4 py-2'>{booking.price}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}