interface CSEIdParams {
	[key: string]: string;
}

interface CustomSearchEngines {
	[key: string]: {
		label: string;
		searchIdParams: CSEIdParams;
	};
}

export class Search {
	private _buildUrl(searchTerms: string): URL {
		const extractCSEIdParams = (cse: CustomSearchEngines): CSEIdParams => {
			let params: CSEIdParams = {};
			Object.values(cse).forEach((val) => {
				params = { ...params, ...val.searchIdParams };
			});

			return params;
		};

		const baseUrl = 'https://cse.google.com/cse';
		const customSearchEngines: CustomSearchEngines = {
			'ng-dev': {
				label: 'Angular development',
				searchIdParams: {
					cx: '838e1bad8dae94387',
				},
			},
		};

		// Ex: 'https://cse.google.com/cse?cx=838e1bad8dae94387#gsc.q=testing router angular'
		let url = new URL(baseUrl);
		url = this._urlEncodeParams(url, {
			...extractCSEIdParams(customSearchEngines),
		});
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

	public getRequestURL(inputText: string): string {
		return this._buildUrl(inputText).toString();
	}
}
