/** @format */

import { useEffect, useRef, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY;

const PlaceAutocomplete = () => {
	const [inputValue, setInputValue] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const autocompleteService = useRef(null);
	const placesService = useRef(null);

	useEffect(() => {
		const loadGoogleMapsScript = () => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`;
			script.async = true;
			script.onload = initGoogleServices;
			document.head.appendChild(script);
		};

		const initGoogleServices = () => {
			autocompleteService.current =
				new window.google.maps.places.AutocompleteService();
			placesService.current = new window.google.maps.places.PlacesService(
				document.createElement('div')
			);
		};

		loadGoogleMapsScript();

		return () => {
			// Cleanup script if needed
		};
	}, []);

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
		if (event.target.value) {
			autocompleteService.current.getPlacePredictions(
				{ input: event.target.value },
				(predictions, status) => {
					if (status === window.google.maps.places.PlacesServiceStatus.OK) {
						Promise.all(
							predictions.map((prediction) => getPlaceDetails(prediction))
						).then((detailedPredictions) => {
							setSuggestions(detailedPredictions.filter(Boolean)); // filter out null values
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
			const request = {
				placeId: prediction.place_id,
				fields: ['address_component', 'geometry.location'],
			};
			placesService.current.getDetails(request, (place, status) => {
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
		setInputValue(suggestion.label);
		setSuggestions([]);
		console.log('Selected suggestion:', suggestion);
	};

	return (
		<div>
			<TextField
				value={inputValue}
				onChange={handleInputChange}
				label='Search for a place'
				fullWidth
				autoComplete='off'
			/>
			{suggestions.length > 0 && (
				<div style={{ position: 'absolute', zIndex: 1, width: '100%' }}>
					{suggestions.map((suggestion) => (
						<MenuItem
							key={suggestion.id}
							onClick={() => handleSuggestionSelect(suggestion)}
						>
							{suggestion.label}
						</MenuItem>
					))}
				</div>
			)}
		</div>
	);
};

export default PlaceAutocomplete;
