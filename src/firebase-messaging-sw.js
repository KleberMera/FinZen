import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { AngularFireMessaging } from '@angular/fire/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCzisdNiu6Q2L6vvs5mFvcSWelZVZWOuaU',
  authDomain: 'finzen-7e19c.firebaseapp.com',
  projectId: 'finzen-7e19c',
  storageBucket: 'finzen-7e19c.firebasestorage.app',
  messagingSenderId: '119155339545',
  appId: '1:119155339545:web:de2efa367f9ac3c15dd588',
  measurementId: 'G-BZNEC94VVF',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});