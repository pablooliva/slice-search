import { Assert } from './assert';

interface CSEIdParams {
	[key: string]: string;
}

interface CustomSearchEngines {
	[key: string]: {
		label: string;
		searchIdParams: CSEIdParams;
	};
}

const customSearchEngines: CustomSearchEngines = {
	ng: {
		label: 'Angular development',
		searchIdParams: {
			cx: '838e1bad8dae94387',
		},
	},
};

type CustomSearchEngineKeys = keyof typeof customSearchEngines;

export class Search {
	private _baseUrl = 'https://cse.google.com/cse';

	private _buildUrl(key: CustomSearchEngineKeys, searchTerms: string): URL {
		// Ex: 'https://cse.google.com/cse?cx=838e1bad8dae94387#gsc.q=testing router angular'
		let url = new URL(this._baseUrl);
		url = this._urlEncodeParams(url, customSearchEngines[key].searchIdParams);
		url = this._addSearchTerms(url, searchTerms);

		return url;
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
		return inputText.substring(keyLenPlusTrailingSpace);
	}

	public getRequestURL(key: CustomSearchEngineKeys, inputText: string): string {
		return this._buildUrl(key, this._getSearchTerms(key, inputText)).toString();
	}

	public getCustomSearchEngineKey(inputText: string): CustomSearchEngineKeys {
		const key = inputText.split(' ')[0];
		Assert.assert(Object.keys(customSearchEngines).includes(key));
		return key;
	}
}
