/** @format */

import { useEffect, useRef, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
import {
	loadGoogleMapsScript,
	getAutocompleteService,
	getPlacesService,
} from '../utils/googleMap';

function PlaceAutocomplete({ placeholder, value, onChange, onPushChange }) {
	const [inputValue, setInputValue] = useState(value);
	const [suggestions, setSuggestions] = useState([]);
	const [showOption, setShowOption] = useState(false);
	const inputRef = useRef(null);
	console.log(suggestions);

	useEffect(() => {
		loadGoogleMapsScript(() => {});
	}, []);

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
		onChange(event);
		if (event.target.value) {
			const autocompleteService = getAutocompleteService();
			autocompleteService.getPlacePredictions(
				{ input: event.target.value },
				(predictions, status) => {
					if (status === window.google.maps.places.PlacesServiceStatus.OK) {
						Promise.all(
							predictions.map((prediction) => getPlaceDetails(prediction))
						).then((detailedPredictions) => {
							setSuggestions(detailedPredictions.filter(Boolean));
						});
					} else {
						setSuggestions([]);
					}
				}
			);
		} else {
			setSuggestions([]);
		}
	};

	const getPlaceDetails = (prediction) => {
		return new Promise((resolve) => {
			const placesService = getPlacesService();
			const request = {
				placeId: prediction.place_id,
				fields: ['address_component', 'geometry.location'],
			};
			placesService.getDetails(request, (place, status) => {
				if (status === window.google.maps.places.PlacesServiceStatus.OK) {
					const postalCode = place.address_components.find((component) =>
						component.types.includes('postal_code')
					)?.long_name;
					const detailedPrediction = {
						label: prediction.description,
						id: prediction.place_id,
						name: null,
						address: prediction.description,
						postcode: postalCode || '',
						type: 2,
						longitude: place.geometry.location.lng(),
						latitude: place.geometry.location.lat(),
					};
					resolve(detailedPrediction);
				} else {
					resolve(null);
				}
			});
		});
	};

	const handleSuggestionSelect = (suggestion) => {
		console.log('clicked');
		setInputValue(suggestion.label);
		onPushChange(suggestion.address, suggestion.postcode);
		setSuggestions([]);
		console.log('Selected suggestion:', suggestion);
	};

	function handleBlur() {
		// Delay onBlur to allow option click to register
		setTimeout(() => {
			setShowOption(false);
		}, 100);
	}

	useEffect(() => {
		if (suggestions.length > 0) setShowOption(true);
	}, [suggestions]);

	return (
		<div className='relative'>
			<TextField
				value={value}
				onBlur={handleBlur}
				ref={inputRef}
				onChange={handleInputChange}
				label={placeholder}
				fullWidth
				autoComplete='off'
				className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full'
			/>
			{showOption && (
				<ul className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[40vh] overflow-auto'>
					{suggestions.map((option, index) => (
						<li
							key={index}
							onClick={() => handleSuggestionSelect(option)}
							className={`px-4 py-2 cursor-pointer hover:bg-gray-100`}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default PlaceAutocomplete;
