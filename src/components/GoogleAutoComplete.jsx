/** @format */

import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import {
	loadGoogleMapsScript,
	getAutocompleteService,
	getPlacesService,
} from '../utils/googleMap';

function PlaceAutocomplete({
	placeholder,
	value,
	onChange,
	onPushChange,
	inputRef,
}) {
	const [suggestions, setSuggestions] = useState([]);
	const [showOption, setShowOption] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	useEffect(() => {
		loadGoogleMapsScript(() => {});
	}, []);

	const handleInputChange = (event) => {
		onChange(event);
		setHighlightedIndex(-1);
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

	function getPlaceDetails(prediction) {
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
	}

	const handleSuggestionSelect = (suggestion) => {
		onPushChange(suggestion.address, suggestion.postcode);
		setSuggestions([]);
		setHighlightedIndex(-1); // Reset highlighted index on selection
	};

	function handleBlur() {
		// Delay onBlur to allow option click to register
		setTimeout(() => {
			setShowOption(false);
		}, 100);
	}

	const handleKeyDown = (event) => {
		if (showOption) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				setHighlightedIndex((prevIndex) =>
					prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
				);
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				setHighlightedIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
				);
			} else if (event.key === 'Enter' && highlightedIndex >= 0) {
				event.preventDefault();
				handleSuggestionSelect(suggestions[highlightedIndex]);
			}
		}
	};

	useEffect(() => {
		if (suggestions.length > 0) setShowOption(true);
	}, [suggestions]);

	return (
		<div className='relative'>
			<TextField
				value={value}
				onBlur={handleBlur}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				label={placeholder}
				fullWidth
				autoComplete='off'
				className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full'
				inputRef={inputRef}
			/>
			{showOption && (
				<ul className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[40vh] overflow-auto'>
					{suggestions.map((option, index) => (
						<li
							key={index}
							onClick={() => handleSuggestionSelect(option)}
							onMouseOver={() => {
								setHighlightedIndex(index);
								onPushChange(option.address, option.postcode);
							}}
							className={`px-4 py-2 cursor-pointer ${
								index === highlightedIndex ? 'bg-gray-100' : ''
							}`}
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
