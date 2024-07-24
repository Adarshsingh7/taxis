/** @format */

import AutoComplete from 'react-google-autocomplete';

const GoogleAutoComplete = () => {
	return (
		<AutoComplete
			apiKey='AIzaSyD4pR99wUBL7JtFDAibNJnVAwBddoRLwZw'
			onPlaceSelected={(place) => console.log(place)}
		/>
	);
};

export default GoogleAutoComplete;
