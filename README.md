GAS Github Json
===============

Uploads the spreadsheet to a github repository as geojson whenever the spreadsheet is updated

**WARNING:** This is experimental and might not work for your use case. The code may be useful for you however.

## What it does

Whenever the user edits the spreadsheet, the edited sheet is added to a list of sheets that needs updated. Every five minutes (you can change this) edited spreadsheets are parsed into geoJSON, using the first row values as the keys, and commited to a github repository.

It uses https://github.com/michael/github/blob/master/github.js adapted for Google Apps Script for interacting with the Github API.

## How to use

Create a new Google Apps Script project from Google Sheets, and copy in the code from `github.gs` and `upload_json`
