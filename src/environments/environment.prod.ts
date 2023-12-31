// environment.prod.ts
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: 'just-links-40f9c.firebaseapp.com',
    databaseURL: 'https://just-links-40f9c-default-rtdb.firebaseio.com',
    projectId: 'just-links-40f9c',
    storageBucket: 'just-links-40f9c.appspot.com',
    messagingSenderId: '512097381820',
    appId: '1:512097381820:web:c035831586b7aa3e9d0fb9',
    measurementId: 'G-H1R4NKCJQT',
  },
};
