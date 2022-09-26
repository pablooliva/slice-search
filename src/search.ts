import { Assert } from './assert';

interface CSEIdParams {
	[key: string]: string;
}

interface CustomSearchEngines {
	[key: string]: {
		label: string;
		searchIdParams: CSEIdParams;
		narrowingSearchTerms?: string[];
	};
}

// TODO: move out to sep. config class
const customSearchEngines: CustomSearchEngines = {
	ng: {
		label: 'Angular development',
		searchIdParams: {
			cx: '838e1bad8dae94387',
		},
	},
	ts: {
		label: 'Typescript development',
		searchIdParams: {
			cx: '75de8fa5bb90f40b2',
		},
		narrowingSearchTerms: ['typescript'],
	},
};

type CustomSearchEngineKeys = keyof typeof customSearchEngines;

export class Search {
	private _customSearchEngines: CustomSearchEngines = customSearchEngines;
	private _baseUrl = 'https://cse.google.com/cse';

	private _buildUrl(key: CustomSearchEngineKeys, searchTerms: string): URL {
		// Ex: 'https://cse.google.com/cse?cx=838e1bad8dae94387#gsc.q=testing router angular'
		let url = new URL(this._baseUrl);
		url = this._urlEncodeParams(
			url,
			this._getSearchIdParams(key, customSearchEngines),
		);
		url = this._addSearchTerms(url, searchTerms);

		return url;
	}

	private _getSearchIdParams(
		key: CustomSearchEngineKeys,
		customSearchEngines: CustomSearchEngines,
	): CSEIdParams {
		return customSearchEngines[key].searchIdParams;
	}

	private _urlEncodeParams(url: URL, params: Record<string, string>): URL {
		const urlCopy = new URL(url);
		Object.entries(params).forEach(([key, val]) => {
			urlCopy.searchParams.append(key, val);
		});

		return urlCopy;
	}

	private _addSearchTerms(url: URL, searchTerms: string): URL {
		return new URL('#gsc.q=' + searchTerms, url);
	}

	private _getSearchTerms(
		key: CustomSearchEngineKeys,
		inputText: string,
	): string {
		const keyLenPlusTrailingSpace = key.toString().length + 1;

		let searchTerms = '';
		if (
			Array.isArray(this._customSearchEngines[key].narrowingSearchTerms) &&
			this._customSearchEngines[key].narrowingSearchTerms?.length !== 0
		) {
			searchTerms +=
				this._customSearchEngines[key].narrowingSearchTerms?.join(' ') + ' ';
		}

		searchTerms += inputText.substring(keyLenPlusTrailingSpace);
		return searchTerms;
	}

	public getRequestURL(key: CustomSearchEngineKeys, inputText: string): string {
		return this._buildUrl(key, this._getSearchTerms(key, inputText)).toString();
	}

	public getCustomSearchEngineKey(inputText: string): CustomSearchEngineKeys {
		const key = inputText.split(' ')[0];
		Assert.assert(Object.keys(this._customSearchEngines).includes(key));
		return key;
	}
}
