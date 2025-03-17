# Webnote UI
Webnote is a Nuxt-based note taking app, intended to run fully inside the browser.  
The UI can run either standalone (in offline mode) or with an [optional synchronization host](https://github.com/Chickenbreadlp/webnote_srv) (configurable using the UIs runtime config).

Please note that when switching the UI from Offline mode to synced mode *will* delete any changes done in offline mode!  
If you want just want to pause synchronization for a little bit, you can do so by clicking on the connection status indicator in synced mode.

## Prerequisites
You'll need a modern version of Node in order to build the web part of the project.  
To also build the android app wrapper, you'll also need to have Android Studio installed, and setup with a recent version of the SDK.

## Setup
Just install all dependencies:
```sh
npm run install
```

## Development Server
Start the development server on `http://localhost:3000`:
```sh
npm run dev
```

## Build
To make a web build run:
```sh
npm run build
```

To make an android build, you first want to create a `.env` file like this:
```dotenv
NUXT_PUBLIC_OFFLINE_MODE=false
NUXT_PUBLIC_API_HOST=(your domain or server ip here)
NUXT_PUBLIC_API_PORT=(your server port here; default 3009)
```
If you want to keep the app completely offline, just change the top one to true.  
For Network sync to work in the app, you have to specify the host here.

Once you are happy with the config, build the UI:
```sh
npm run generate
```
This will make a static build of the app and sync the changes to the capacitor android project.  
Now open the android project:
```sh
npx cap open android
```
And build the app from there.
