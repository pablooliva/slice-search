import * as browser from 'webextension-polyfill';
import { Search } from './search';

class SliceBackground {
	constructor() {
		browser.omnibox.setDefaultSuggestion({
			description: `Search a custom Slice: type "ss" [custom-search-keyword] [search-terms]`,
		});

		this.setListeners();
	}

	private setListeners() {
		browser.omnibox.onInputChanged.addListener((inputText) => {
			console.log('CHANGED', inputText);
		});

		browser.omnibox.onInputEntered.addListener((inputText) => {
			console.log('ENTERED', inputText);
			const search = new Search();
			const key = search.getCustomSearchEngineKey(inputText);
			const url = search.getRequestURL(key, inputText);
			browser.tabs.update({ url }).catch((error) => console.error(error));
		});
	}
}

new SliceBackground();
