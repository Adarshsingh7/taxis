/** @format */

// googleMapsService.js

let isLoaded = false;
let autocompleteService = null;
let placesService = null;

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY;

export const loadGoogleMapsScript = (callback) => {
	if (isLoaded) {
		callback();
		return;
	}

	const script = document.createElement('script');
	script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places&components=country:GB`;
	script.async = true;
	script.onload = () => {
		isLoaded = true;
		autocompleteService = new window.google.maps.places.AutocompleteService();
		placesService = new window.google.maps.places.PlacesService(
			document.createElement('div')
		);
		callback();
	};
	document.head.appendChild(script);
};

export const getAutocompleteService = () => autocompleteService;
export const getPlacesService = () => placesService;
