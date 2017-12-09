Stockpile
=========

> n. - A storage pile accumulated for future use

A PhoneGap example app using [Vue.js](https://vuejs.org), [Framework7 (with Vue.js bindings)](http://framework7.io/vue) and the [Adobe Stock API](https://www.adobe.io/apis/creativecloud/stock/).

![Stockpile Icon](https://raw.githubusercontent.com/phonegap/phonegap-app-stockpile/master/res/icon/ios/icon-83.5%402x.png "Stockpile Icon")

## Previewing the app

Hosted version of the [Stockpile App](https://phonegap-stockpile-app.firebaseapp.com/).

### Requirements

- PhoneGap CLI: `npm install -g phonegap`
- Adobe Stock API key
  - TODO: Add Adobe Stock registration instructions

#### Getting an Adobe Stock API key

1. Start by visiting the [Adobe I/O Console](https://console.adobe.io/integrations) Integrations.
2. Click "New Integration", then choose "Access an API" --Continue
3. Next choose "Adobe Stock" and "OAuth Integration" below that -- Continue
4. Choose "New integration" -- Continue
5. Give your integration a name like "Stockpile" and a Description like "A test Adobe Stock integration with a PhoneGap app"
6. Choose Web as the platform
7. The Default redirect URI part is not used by this app, so put in any URL (preferably your own). I have used "https://phonegap.com" and "https://phonegap\.com" for the Redirect URI pattern.
8. Prove you are not a robot, then click the Create integration button
9. Your integration has been created. Click "Continue to integration details" to get your API key
10. Your API key will be under "API Key (Client ID)" on the left. You'll need to use that instead of the dummy key in `src/utils/config.js`

### Clone

```
git clone https://github.com/phonegap/phonegap-app-stockpile
cd phonegap-app-stockpile
npm install
npm run build
phonegap serve
```

Another option, for rapid developing in the browser, instead of `npm run build` and `phonegap serve`, you can also use

```
npm run dev
```

...which will run a hot reloading server and start up the browser at `http://localhost:8080`. This will also allow use of the [Vue.js development extension in Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)

### View

You can now view the app either in a browser at`localhost:3000`, or using the [PhoneGap Developer App](http://app.phonegap.com/) on your device(s).


Of course, all the other PhoneGap CLI commands work as expected.

```
phonegap platform add ios
phonegap run ios
cordova platform add android
cordova run android --device
```

etc...


## Build & Deploy to the Web

### Build the app

`npm run build`

### Deploying the App

## Setup Firebase - these steps only need to be done the first time you deploy the app to Firebase

1. run `npm run login` to link your local machine to your Firebase account

2. run `npm run init` to initialize your project on Firebase (choose the options listed below)

- choose Hosting
- set public dir to `www`
- configure as single-page app: `no`

## Deploy the app

1. run `npm run deploy` to upload your app to Firebase.
