GAS Github Json
===============

Uploads the spreadsheet to a github repository as geojson whenever the spreadsheet is updated

**WARNING:** This is experimental and might not work for your use case. The code may be useful for you however.

## What it does

Whenever the user edits the spreadsheet, the edited sheet is added to a list of sheets that needs updated. Every five minutes (you can change this) edited spreadsheets are parsed into geoJSON, using the first row values as the keys. It looks for a "_geom" column which should include valid geoJSON geometry. The parsed geoJSON is commited to a Github repository.

It uses https://github.com/michael/github/blob/master/github.js adapted for Google Apps Script for interacting with the Github API.

## How to use

Create a new Google Apps Script project from Google Sheets, and copy in the code from `github.gs` and `upload_json`. You will need to add the underscore library for GAS, which you can search for from the menu "Resources --> Libraries.." under this code `MGwgKN2Th03tJ5OdmlzB8KPxhMjh3Sh48`. Add triggers to run `onUpdated` on edit, and `updateGithub` every 5 minutes (or whatever you want). It will not commit anything to github if the spreasheet has not bee updated.

## Why?

We are using Google Sheets to manage data for a web map. We started using the Google Sheets "Publish to Web" option as CSV, but response times are slow, it is harder to parse, and the publish to web function does not work with CSV yet with the new version of Google Sheets. This way we follow the concept of [static sites](http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/) to update a static geojson file that is updated whenever the data is updated.

## Limitations

The script has a hack around a Google Sheets bug which crashes when you call `getValues()` on a range that includes an `=IMAGE()` function.

The Github key is currently hard-coded into the code - we should get each user to authenticate with github when they use the Sheet. Pull requests welcome!

I have done no testing on this. It works for our particular dataset at this time.
