import * as browser from 'webextension-polyfill';
import { CustomSearchEngines, CustomSearchEnginesOption } from './search';

export class Options {
	public static storageKey = 'cseOptions';
	public static cseDefaultOptions: CustomSearchEngines = {
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

	private _form = document.querySelector('#options-form');
	private _formListElement = document.querySelector('.form-list');
	private _formAddOptionBtn = document.querySelector('#form-add-option');
	private _formSaveBtn = document.querySelector('#form-submit-btn');

	constructor() {
		this.accessStorage().then((storedItems) => {
			this._generateOptionsHtml(storedItems);
		});

		this._addEventListeners();
	}

	public accessStorage() {
		const storageTest = browser.storage.sync.get();

		return new Promise<CustomSearchEngines>((resolve) => {
			storageTest.then((result) => {
				if (Object.keys(result[Options.storageKey]).length === 0) {
					browser.storage.sync.set({
						[Options.storageKey]: Options.cseDefaultOptions,
					});
				}

				const storageItem = browser.storage.sync.get();
				storageItem.then((storedItems) => {
					resolve(storedItems[Options.storageKey]);
				});
			});
		});
	}

	private _addEventListeners() {
		this._addAddFormOptionListener();
		this._addSaveListener();
	}

	private _addAddFormOptionListener() {
		if (this._formAddOptionBtn) {
			this._formAddOptionBtn.addEventListener('click', () => {
				if (this._formListElement) {
					this._formListElement.innerHTML += this._buildFormRow();
				}
			});
		}
	}

	private _addSaveListener() {
		if (this._formSaveBtn && this._form) {
			this._formSaveBtn.addEventListener('click', () => {
				const formData = new FormData(this._form as HTMLFormElement);
				const options: CustomSearchEngines = {};
				let tempKey = '';

				for (const pair of formData.entries()) {
					if (pair[0].match(/-key$/g)) {
						tempKey = pair[1] as string;
						options[tempKey] = {} as CustomSearchEnginesOption;
					}
					if (pair[0].match(/-label$/)) {
						options[tempKey]['label'] = pair[1] as string;
					}
					if (pair[0].match(/-cx-id$/)) {
						options[tempKey]['searchIdParams'] = { cx: pair[1] as string };
					}
					if (pair[0].match(/-search-narrowing$/)) {
						options[tempKey]['searchNarrowingTerms'] = (
							pair[1] as string
						).split(' ');
					}
				}

				browser.storage.sync.set({
					[Options.storageKey]: options,
				});
			});
		}
	}

	private _generateOptionsHtml(cseOptions: CustomSearchEngines) {
		let append = '';

		Object.keys(cseOptions).forEach((key) => {
			append += this._buildFormRow(key, cseOptions[key]);
		});

		if (this._formListElement) {
			this._formListElement.innerHTML = append;
		}
	}

	private _buildFormRow(key?: string, cse?: CustomSearchEnginesOption) {
		const substitute = Date.now();
		const elemId = (post: string) => 'cse-' + (key ?? substitute) + '-' + post;
		const getValue = (prop: unknown) => prop ?? '';

		return `<li>
      <div class="input-container">
      <label for="${elemId('key')}">Key</label>
      <input type="text" id="${elemId('key')}" name="${elemId('key')}"
        value="${getValue(key)}" />
      </div>

      <div class="input-container">
      <label for="${elemId('label')}">Label</label>
      <input type="text" id="${elemId('label')}" name="${elemId('label')}"
        value="${getValue(cse?.label)}" />
      </div>

      <div class="input-container">
      <label for="${elemId('cx-id')}">CSE Id</label>
      <input type="text" id="${elemId('cx-id')}" name="${elemId('cx-id')}"
        value="${getValue(cse?.searchIdParams.cx)}" />
      </div>

      <div class="input-container">
      <label for="${elemId('search-narrowing')}">Search narrowing terms</label>
      <input
        type="text"
        id="${elemId('search-narrowing')}"
        name="${elemId('search-narrowing')}"
        value="${getValue(cse?.searchNarrowingTerms)}"
      />
      </div>
    </li>`;
	}
}

function initOptions(e: Event) {
	new Options();
	e.preventDefault();
}

document.addEventListener('DOMContentLoaded', initOptions);
