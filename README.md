# PokerMaster

PokerMaster is a React Native app built with Expo, designed to manage poker balances and synchronize data with Google Sheets. This makes it easy to track players, input game results, and keep a running total of balances in real time.
Install the latest release from GitHub to start using the app now!

<p align="left">
<img width=150 src=screenshots/Add.png/>
<img width=150 src=screenshots/History.png/>
<img width=150 src=screenshots/Total.png/>
<img width=150 src=screenshots/Settings.png/>
</p>

_Add, history, total and settings screen._

## Features
- Login with Google
- Select a target Google Spreadsheet
- create a new Google Spreadsheet
- Set default buy-in amount
- Add start and end amounts for each player
- Automatically update the sheet and track totals
- View history of previous entries
- Edit previous entries
- View totals in a separate screen

## Requirements
- Node.js and npm
- Expo CLI
- Google Cloud project with OAuth credentials
- React Native development environment (Android)

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Add your Google Cloud credentials (client ID) to `.env`.

## Usage
1. To package apk file for Android, run: `./gradlew :app:assembleRelease` from `android` folder.
2. The apk file can be found in `android\app\build\outputs\apk\release`.
