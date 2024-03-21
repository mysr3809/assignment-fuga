# Track Importer

## Description

This project provides a Node.js script for importing track data from an Excel spreadsheet into a MongoDB database using Mongoose. It handles data validation, processes ISRC codes and aliases, checks for duplicate entries, and associates tracks with contracts if a match is found in the database.

## Code Structure
`
.
├── models
│ ├── Contract.js
│ └── Track.js
├── src
│ ├── database.js
│ └── importData.js
├── test
│ └── importData.test.js
└── utils
├── processRow.js
└── validationRow.js
├── Track Import Test.xlsx
├── package-lock.json
├── package.json
`

## Features

- Data validation for each row in the spreadsheet.
- Cleaning and processing of ISRC codes and aliases.
- Checking and skipping duplicate ISRC entries.
- Association of tracks with contracts based on contract name.
- Detailed error logging for invalid data rows.

## Requirements

- Node.js
- MongoDB
- A `.env` file with your MongoDB URI set as `MONGODB_URI`.

## Installing

First, clone the repository to your local machine:

`
git clone https://github.com/mysr3809/assignment-fuga.git
cd assignment-fuga
`

Then install the project dependencies with `npm install`.

Set up the environment variables:

Create a .env file in the root directory and add the following line `MONGODB_URI=your_mongodb_uri`

## Run the Project

To run the script and import data from the Excel file use this command `npm run start`

## Run the Test

To run the tests for the application, use `npm test`
