export const environment = {
  apiUrl: import.meta.env.NG_APP_API_URL_PROD,
  firebaseConfig: {
    apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.NG_APP_FIREBASE_MEASUREMENT_ID,
  },
  apiUrlEmail: import.meta.env.NG_APP_EMAIL_VERIFICATION_URL,
  apiKeyEmail: import.meta.env.NG_APP_EMAIL_VERIFICATION_API_KEY,
  VAPID_PUBLIC_KEY: import.meta.env.NG_APP_VAPID_PUBLIC_KEY,
  production: true,
};
