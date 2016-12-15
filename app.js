import {app, BrowserWindow, Menu, Tray} from 'electron'
import firebase from 'firebase'

import initTrayMenu from './trayMenu'

firebase.initializeApp({
  apiKey: "AIzaSyCCFO2zCdQlOs7rN9T5Yd4YbSZf0Qv6OzU",
  authDomain: "pairedprogramming.firebaseapp.com",
  databaseURL: "https://pairedprogramming.firebaseio.com",
  storageBucket: "pairedprogramming.appspot.com",
  messagingSenderId: "396708558029"
})

app.on('ready', () => {
  initTrayMenu()
})

app.on('window-all-closed', () => {})