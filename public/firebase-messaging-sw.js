importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyCzisdNiu6Q2L6vvs5mFvcSWelZVZWOuaU',
    authDomain: 'finzen-7e19c.firebaseapp.com',
    projectId: 'finzen-7e19c',
    storageBucket: 'finzen-7e19c.firebasestorage.app',
    messagingSenderId: '119155339545',
    appId: '1:119155339545:web:de2efa367f9ac3c15dd588',
    measurementId: 'G-BZNEC94VVF',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'favicon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});