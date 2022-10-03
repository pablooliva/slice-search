import * as browser from 'webextension-polyfill';
import { CustomSearchEngines, CustomSearchEnginesOption } from './search';

export class Options {
	private _storageKey = 'cseOptions';

	public cseDefaultOptions: CustomSearchEngines = {
		ng: {
			label: 'Angular development',
			searchIdParams: {
				cx: '838e1bad8dae94387',
			},
			searchNarrowingTerms: ['angular'],
		},
		ts: {
			label: 'Typescript development',
			searchIdParams: {
				cx: '75de8fa5bb90f40b2',
			},
			searchNarrowingTerms: ['typescript'],
		},
		js: {
			label: 'JavaScript development',
			searchIdParams: {
				cx: '4061c9c6baa7e4a11',
			},
			searchNarrowingTerms: ['javascript'],
		},
		rx: {
			label: 'RxJS',
			searchIdParams: {
				cx: '431dabc81e7f84b1a',
			},
			searchNarrowingTerms: ['rxjs'],
		},
	};

	constructor() {
		this.accessStorage().then((storedItems) => {
			this._generateOptionsHtml(storedItems);
		});
	}

	public accessStorage() {
		const storageTest = browser.storage.sync.get(this._storageKey);

		return new Promise<CustomSearchEngines>((resolve) => {
			storageTest.then((result) => {
				if (Object.keys(result).length === 0) {
					browser.storage.sync.set({
						[this._storageKey]: this.cseDefaultOptions,
					});
				}

				const storageItem = browser.storage.sync.get();
				storageItem.then((storedItems) => {
					resolve(storedItems[this._storageKey]);
				});
			});
		});
	}

	private _generateOptionsHtml(cseOptions: CustomSearchEngines) {
		const optionFormRow = (key: string, cse: CustomSearchEnginesOption) => {
			const prepend = 'cse-' + key;
			return `<li>
<div class="input-container">
<label for="${prepend}-label">Label</label>
<input type="text" id="${prepend}-label" name="${prepend}-label" value="${cse.label}" />
</div>

<div class="input-container">
<label for="${prepend}-key">Key</label>
<input type="text" id="${prepend}-key" name="${prepend}-key" value="${key}" />
</div>

<div class="input-container">
<label for="${prepend}-cx-id">CSE Id</label>
<input type="text" id="${prepend}-cx-id" name="${prepend}-cx-id" value="${cse.searchIdParams.cx}" />
</div>

<div class="input-container">
<label for="${prepend}-search-narrowing">Search narrowing terms</label>
<input
type="text"
id="${prepend}-search-narrowing"
name="${prepend}-search-narrowing"
value="${cse.searchNarrowingTerms}"
/>
</div>
</li>`;
		};

		const formList = document.querySelector('.form-list');
		let append = '';

		Object.keys(cseOptions).forEach((key) => {
			append += optionFormRow(key, cseOptions[key]);
		});

		if (formList) {
			formList.innerHTML = append;
		}
	}
}

function initOptions(e: Event) {
	new Options();
	e.preventDefault();
}

document.addEventListener('DOMContentLoaded', initOptions);
