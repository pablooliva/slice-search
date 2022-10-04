import * as browser from 'webextension-polyfill';
import { runtime } from 'webextension-polyfill';
import { CustomSearchEngines, Search } from './search';
import { Options } from './options';

class SliceBackground {
	private _customSearchEngines!: CustomSearchEngines;

	constructor() {
		this._setOptions();
		this._watchForOptionsChanges();

		browser.omnibox.setDefaultSuggestion({
			description: `Search a custom Slice: type "ss" [custom-search-keyword] [search-terms]`,
		});

		this._setListeners();
	}

	private _setOptions() {
		const options = browser.storage.sync.get();
		options.then((result) => {
			if (result[Options.storageKey] === undefined) {
				browser.storage.sync.set({
					[Options.storageKey]: Options.cseDefaultOptions,
				});
			}

			this._customSearchEngines =
				result[Options.storageKey] ?? Options.cseDefaultOptions;
		});
	}

	private _watchForOptionsChanges() {
		browser.storage.sync.onChanged.addListener(() => {
			this._setOptions();
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

		browser.browserAction.onClicked.addListener(() => {
			runtime.openOptionsPage();
		});
	}
}

new SliceBackground();
