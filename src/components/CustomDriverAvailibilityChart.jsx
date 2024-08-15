/** @format */

const data = [
	{
		userId: 8,
		fullName: 'Peter Farrell',
		date: '2024-08-15T00:00:00',
		colorCode: '#333333ff',
		vehicleType: 0,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '10:00:00',
				to: '20:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 3,
		fullName: 'Bex Sims',
		date: '2024-08-15T00:00:00',
		colorCode: '#d03a20ff',
		vehicleType: 2,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 4,
		fullName: 'Paul Barber',
		date: '2024-08-15T00:00:00',
		colorCode: '#86b953ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 5,
		fullName: 'Mark Phillips ',
		date: '2024-08-15T00:00:00',
		colorCode: '#d44a7adc',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '13:00:00',
				to: '15:00:00',
				note: '',
			},
			{
				from: '17:00:00',
				to: '18:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 6,
		fullName: 'Rob Holton',
		date: '2024-08-15T00:00:00',
		colorCode: '#59c4f7ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [],
		allocatedHours: [],
	},
	{
		userId: 7,
		fullName: 'Caroline Stimson',
		date: '2024-08-15T00:00:00',
		colorCode: '#f09286b7',
		vehicleType: 1,
		availableHours: [
			{
				from: '11:00:00',
				to: '12:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 1,
		fullName: 'ACE TAXIS',
		date: '2024-08-15T00:00:00',
		colorCode: '#591e77d4',
		vehicleType: 0,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '17:00:00',
				to: '19:00:00',
				note: '',
			},
			{
				from: '20:00:00',
				to: '22:00:00',
				note: '',
			},
			{
				from: '10:30:00',
				to: '21:00:00',
				note: 'AM School Run Only',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 9,
		fullName: 'Lee Christopher',
		date: '2024-08-15T00:00:00',
		colorCode: '#fefb67ff',
		vehicleType: 0,
		availableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		unAvailableHours: [
			{
				from: '10:30:00',
				to: '22:00:00',
				note: '',
			},
		],
		allocatedHours: [],
	},
	{
		userId: 2,
		fullName: 'Kate Hall',
		date: '2024-08-15T00:00:00',
		colorCode: '#c45ff6ff',
		vehicleType: 3,
		availableHours: [
			{
				from: '07:30:00',
				to: '09:15:00',
				note: 'AM School Run Only',
			},
		],
		unAvailableHours: [
			{
				from: '14:30:00',
				to: '16:15:00',
				note: 'PM School Run Only',
			},
		],
		allocatedHours: [],
	},
];
const getPercentage = (time) => {
	const [hours, minutes] = time.split(':').map(Number);
	return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

const WrapperDiv = function () {
	return (
		<>
			<div className='h-[60vh] w-[300px]'>
				<div className='flex h-full w-full'>
					<div className='flex flex-col h-full w-10'>
						{Array.from({ length: 24 }, (_, i) => (
							<div
								key={i}
								className='text-xs flex-grow border-t-[1px] border-t-black w-full'
								style={{ height: `${100 / 24}%` }}
							>
								<p>{i}:00</p>
							</div>
						))}
					</div>

					<div className='h-full bg-gray-200 w-[300px] flex justify-between gap-0.5 border-l-black border-l-[1px]'>
						{data.map((driver, index) => (
							<TimeBar
								key={index}
								availableHours={driver.availableHours}
							/>
						))}
					</div>
				</div>
			</div>
			<div className='flex w-[300px] justify-start ml-7'>
				{data.map((driver, i) => (
					<div
						key={i}
						className='text-xs text-center flex items-start rotate-[-90deg] '
						style={{ width: `${100 / data.length}%` }}
					>
						<p className=''>{driver.fullName.split(' ')[0]}</p>
					</div>
				))}
			</div>
		</>
	);
};

const TimeBar = ({ availableHours }) => {
	console.log(availableHours);
	if (!availableHours) return null;
	return (
		<div className='relative h-full w-10'>
			{availableHours?.map((slot, index) => {
				const fromPercent = getPercentage(slot.from);
				const toPercent = getPercentage(slot.to);
				const heightPercent = toPercent - fromPercent;

				return (
					<div
						key={index}
						title={slot.note}
						style={{
							position: 'absolute',
							top: `${fromPercent}%`,
							height: `${heightPercent}%`,
							width: '100%',
							backgroundColor: 'green',
						}}
					/>
				);
			})}
		</div>
	);
};

export default WrapperDiv;
