/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Dragger from '../Dragger';
import Autocomplete from '../AutoComplete';
import GoogleAutoComplete from '../GoogleAutoComplete';
import LongButton from './LongButton';
import { updateValue } from '../../context/bookingSlice';

const AddAndEditVia = ({ onSet }) => {
	// fetching global state for via points
	const dispatch = useDispatch();
	const data = useSelector((state) => state.bookingForm.bookings);
	const id = useSelector((state) => state.bookingForm.activeBookingIndex);

	// local state for the via points
	const [vias, setVias] = useState(data[id].vias);
	const [newViaAddress, setNewViaAddress] = useState('');
	const [newViaPostcode, setNewViaPostcode] = useState('');

	// This function add the via point to the via list
	const handleAddVia = () => {
		if (newViaAddress || newViaPostcode) {
			setVias((prevVias) => [
				...prevVias,
				{
					address: newViaAddress,
					postCode: newViaPostcode,
					viaSequence: prevVias.length,
				},
			]);
			setNewViaAddress('');
			setNewViaPostcode('');
		}
	};

	// This function updates the via point in the via list
	function handleSetVias(viasArray) {
		setVias(viasArray.map((via, index) => ({ ...via, viaSequence: index })));
	}

	// acts as an path between our global state and local state works only on saving of any event
	function handleSave() {
		dispatch(updateValue(id, 'vias', vias));
		onSet(false);
	}

	// This function handles the selection of the autocomplete address and make changes on the modal level
	function handleSelectAutocomplete({ address, postcode }) {
		setNewViaAddress(address);
		setNewViaPostcode(postcode);
	}

	return (
		<div className='bg-white p-6 rounded-lg shadow-lg w-[25vw] max-w-md mx-auto'>
			<h2 className='text-2xl font-semibold mb-4 flex items-center'>
				<svg
					className='h-6 w-6 text-gray-600 mr-2'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M9 11h6m-3-3v6m-4 4h8a2 2 0 002-2V7a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
					></path>
				</svg>
				Manage Via Points
			</h2>

			<div className='space-y-2 mb-4 max-h-[30vh] overflow-auto'>
				<Dragger
					items={vias}
					setItems={handleSetVias}
					Child={VIABar}
				/>
			</div>

			<div className='space-y-4'>
				<GoogleAutoComplete
					placeholder='Pickup Address'
					value={newViaAddress}
					onPushChange={handleSelectAutocomplete}
					onChange={(e) => setNewViaAddress(e.target.value)}
				/>
				<Autocomplete
					type='postal'
					required={false}
					placeholder='Add Via PostCode'
					value={newViaPostcode}
					onChange={(e) => setNewViaPostcode(e.target.value)}
					onPushChange={handleSelectAutocomplete}
				/>
				<LongButton
					color='bg-gray-700'
					onClick={handleAddVia}
				>
					Add New Via
				</LongButton>
			</div>

			<div className='mt-4 flex flex-row gap-1'>
				<LongButton
					color='bg-red-700'
					onClick={() => onSet(false)}
				>
					Cancel
				</LongButton>
				<LongButton
					onClick={handleSave}
					color='bg-green-700'
				>
					Save
				</LongButton>
			</div>
		</div>
	);
};

// Each Strip of VIA which has been added of exist are displayed by this component
function VIABar({ data, onEdit, isEditing, setEditingItem }) {
	const [newAddress, setNewAddress] = useState(data.address);
	const [newPostcode, setNewPostcode] = useState(data.postCode);

	useEffect(() => {
		setNewAddress(data.address);
		setNewPostcode(data.postCode);
	}, [data]);

	// This function is used to edit the via point independently
	const handleEdit = () => {
		if (!newAddress && !newPostcode) return;
		onEdit({ ...data, address: newAddress, postCode: newPostcode });
	};

	return (
		<div className='flex gap-5 p-2 rounded'>
			{isEditing ? (
				<div className='flex flex-col gap-2'>
					<input
						className='border'
						value={newAddress}
						onChange={(e) => setNewAddress(e.target.value)}
					/>
					<input
						className='border'
						value={newPostcode}
						onChange={(e) => setNewPostcode(e.target.value)}
					/>
				</div>
			) : (
				<span>
					{data.address} {data.postCode}
				</span>
			)}
			<div className='space-x-2 m-auto'>
				{isEditing ? (
					<button
						className='text-blue-500 hover:text-blue-700'
						onClick={handleEdit}
					>
						<CheckCircleIcon fontSize='5px' />
					</button>
				) : (
					<button
						className='text-blue-500 hover:text-blue-700'
						onClick={() => setEditingItem(data)}
					>
						<EditIcon fontSize='5px' />
					</button>
				)}
			</div>
		</div>
	);
}

export default AddAndEditVia;
