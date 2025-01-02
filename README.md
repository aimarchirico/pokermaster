# PokerMaster Pro

PokerMaster Pro is a React Native app built with Expo, designed to manage poker balances and synchronize data with Google Sheets. This makes it easy to track players, input game results, and keep a running total of balances in real time.

## Features
- Login with Google
- Select a target Google Spreadsheet
- Add start and end amounts for each player
- Automatically update the sheet and track balances
- View totals in a separate screen

## Requirements
- Node.js and npm
- Expo CLI
- Google Cloud project with OAuth credentials
- React Native development environment (Android)

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Add your Google credentials (client ID) to `src/assets/clientId.ts`.

## Usage
1. To package apk file for android, run: `./gradlew :app:assembleRelease` from `android` folder.
2. The apk file can be found in `android\app\build\outputs\apk\release`.
