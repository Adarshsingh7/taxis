/** @format */

import Client from 'getaddress-api';

const api = new Client('RCX7bLL_a0C5xaApbiBLFQ983');

const autocompleteResult = await api.autocomplete('32 ridg');

if (autocompleteResult.isSuccess) {
	var success = autocompleteResult.toSuccess();

	for (const suggestion of success.suggestions) {
		const address = await api.get(suggestion.id);
	}
} else {
	const failed = autocompleteResult.toFailed();
	console.log(failed);
}
