import * as browser from 'webextension-polyfill';
import { CustomSearchEngines, CustomSearchEnginesOption } from './search';

export class Options {
	private _storageKey = 'cseOptions';
	private _form = document.querySelector('#options-form');
	private _formListElement = document.querySelector('.form-list');
	private _formAddOptionBtn = document.querySelector('#form-add-option');
	private _formSaveBtn = document.querySelector('#form-submit-btn');

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

		this._addEventListeners();
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
		// TODO
		if (this._formSaveBtn && this._form) {
			this._formSaveBtn.addEventListener('click', () => {
				console.warn(new FormData(this._form as HTMLFormElement));
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
      <label for="${elemId('label')}">Label</label>
      <input type="text" id="${elemId('label')}" name="${elemId('label')}"
        value="${getValue(cse?.label)}" />
      </div>

      <div class="input-container">
      <label for="${elemId('key')}">Key</label>
      <input type="text" id="${elemId('key')}" name="${elemId('key')}"
        value="${getValue(key)}" />
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
