/** @format */

import AutoComplete from 'react-google-autocomplete';

const GoogleAutoComplete = () => {
	return (
		<AutoComplete
			apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
			onPlaceSelected={(place) => console.log(place)}
		/>
	);
};

export default GoogleAutoComplete;
