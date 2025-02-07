import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-sw.js";

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCzisdNiu6Q2L6vvs5mFvcSWelZVZWOuaU',
  authDomain: 'finzen-7e19c.firebaseapp.com',
  projectId: 'finzen-7e19c',
  storageBucket: 'finzen-7e19c.firebasestorage.app',
  messagingSenderId: '119155339545',
  appId: '1:119155339545:web:de2efa367f9ac3c15dd588',
  measurementId: 'G-BZNEC94VVF',
});

const messaging = getMessaging(firebaseApp);

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'favicon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});