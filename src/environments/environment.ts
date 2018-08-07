// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:{
    apiKey: "AIzaSyBvlC9laeRq-9kt_W52O2Q0YjW862jJns4",
    authDomain: "webappauth-b9c2a.firebaseapp.com",
    databaseURL: "https://webappauth-b9c2a.firebaseio.com",
    projectId: "webappauth-b9c2a",
    storageBucket: "webappauth-b9c2a.appspot.com",
    messagingSenderId: "301506225573"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
