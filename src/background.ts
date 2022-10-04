import * as browser from 'webextension-polyfill';
import { CustomSearchEngines, Search } from './search';
import { Options } from './options';

class SliceBackground {
	private _customSearchEngines!: CustomSearchEngines;

	constructor() {
		this._initOptions();

		browser.omnibox.setDefaultSuggestion({
			description: `Search a custom Slice: type "ss" [custom-search-keyword] [search-terms]`,
		});

		this._setListeners();
	}

	private _initOptions() {
		const options = browser.storage.sync.get();
		options.then((result) => {
			this._customSearchEngines =
				result[Options.storageKey] ?? Options.cseDefaultOptions;
		});
	}

	private _setListeners() {
		browser.omnibox.onInputChanged.addListener((inputText) => {
			console.log('CHANGED', inputText);
		});

		browser.omnibox.onInputEntered.addListener((inputText) => {
			console.log('ENTERED', inputText);
			const search = new Search(this._customSearchEngines);
			const key = search.getCustomSearchEngineKey(inputText);
			const url = search.getRequestURL(key, inputText);
			browser.tabs.update({ url }).catch((error) => console.error(error));
		});
	}
}

new SliceBackground();
