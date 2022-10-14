# Slice Search

This [extension](https://addons.mozilla.org/en-US/firefox/addon/slice-custom-search/) allows you to search a **Slice** of the internet. The extension connects your query in the omnibar to search results configured in a [Google Programmable Search Engine](https://programmablesearchengine.google.com/).

The extension is currently only available for Firefox. If there is enough interest, I will spend the time needed to make the changes necessary for a Chrome extension.

## Get Started

To use the extension, you will need to:
1. Create and configure a [Google Programmable Search Engine (GPSE)](https://developers.google.com/custom-search).
2. Configure the extension.

## 1. Create and Config a GPSE

When you create a new GPSE, you can either use your own list of domains to limit the search, or you can use the existing list of domains found in our [gpse-config](./gpse-config) folder.

### 1.A. - Use your own domains

Create a custom GPSE using only the domains of your choice:

1. Go to the [GPSE Control Panel](https://programmablesearchengine.google.com/controlpanel/all) and click on the "Add" button.
2. Give your GPSE a name.
3. Leave the "Search specific sites or pages" selected.
4. Add the domains that you would like to have your GPSE limited to.
5. Move on to section "2. Configure the Extension."

### 1.B. - Use my pre-selected domains

Create a custom GPSE using lists of domains that I, the author of this extension, have found to be most useful.

Currently, pre-defined lists of domains exist for:
1. [JavaScript](./gpse-config/js-annotations.tsv)
2. [Angular](./gpse-config/ng-annotations.tsv)
3. [RxJS](./gpse-config/rx-annotations.tsv)
4. [TypeScript](./gpse-config/ts-annotations.tsv)

Create and config your GPSE:

1. Go to the [GPSE Control Panel](https://programmablesearchengine.google.com/controlpanel/all) and click on the "Add" button.
2. Give your GPSE a name.
3. Leave the "Search specific sites or pages" selected.
4. Add the first domain, or a dummy domain, that you would like to have your GPSE limited to.
5. Click on "Customize" in the result page.
6. At the top of the new page, you should see "Go to legacy Control Panel." Click on that button.
7. Click on the "Advanced" tab.
8. Then expand the "Search engine annotations" section.
9. Finally, click on the "Add" button under the "Upload annotations" section.
10. Select the list of domains that you would like to use for this GPSE.
11. Move on to section "2. Configure the Extension."

## 2. Configure the Extension

1. Install the [extension](https://addons.mozilla.org/en-US/firefox/addon/slice-custom-search/) for Firefox.
2. Copy the "Search engine id" found in the Overview page of your GPSE control panel.
3. Click on the icon for Slice Custom Search in your browser toolbar.
4. Fill in the necessary input fields and save the configuration.
5. You are now ready to search the domains defined in your GPSE by starting your search in the omnibar using the characters "ss " (that is ss with a space character).

### Attribution

This was inspired by Ravi's [extension](https://github.com/rsins/ravi-firefox-custom-search-engines).
