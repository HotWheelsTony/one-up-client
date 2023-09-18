# One Up client

## About

This client aims to provide a simple approach to viewing your personal spending & transactional data kindly provided by [Up's public API](https://developer.up.com.au/#welcome)

## Required

* [Node](https://nodejs.org/en)
* [Angular CLI](https://www.npmjs.com/package/@angular/cli)
* [Up API personal access token](https://api.up.com.au/getting_started)

## Development server

Run `ng serve` for a dev server at `http://localhost:4200/` 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Run on physical device

__Android via Capacitor__
  * [Install Android studio & Android SDK](https://developer.android.com/studio)

  * Build the project 
    * `ng build`

  * [Install Capacitor](https://capacitorjs.com/docs/getting-started)
    * `npm i @capacitor/core`
    * `npm i -D @capacitor/cli`
  * Install Android platform
    * `npm i @capacitor/android`
  * Create Android project for native application & sync code
    * `npx cap add android`
    * `npx cap sync`
  * Run on device
    * Ensure your physical Android device is connected to your machine
    * Run `npx cap run android`
    
    Note: if you run into Gradle build errors you may need to specify your Android SDK location, simply create `/android/local.properties` and make sure the file contains the correct path, for example: `sdk.dir=C\:\\Users\\<USERNAME>\\AppData\\Local\\Android\\Sdk`  

  * To see changes on physical device
    * Run `ng build` then `npx cap run android`


__iOS via Capacitor__
  *Working on it




