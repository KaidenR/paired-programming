// import {app, BrowserWindow, Menu, Tray} from 'electron'
import firebase from 'firebase'

import initTrayMenu from './trayMenu'
import menubar from 'menubar'

// firebase.initializeApp({
//   apiKey: "AIzaSyCCFO2zCdQlOs7rN9T5Yd4YbSZf0Qv6OzU",
//   authDomain: "pairedprogramming.firebaseapp.com",
//   databaseURL: "https://pairedprogramming.firebaseio.com",
//   storageBucket: "pairedprogramming.appspot.com",
//   messagingSenderId: "396708558029"
// })

const mb = menubar({
  icon: './iconTemplate.png',
  index: `file://${process.cwd()}/menu/index.html`
})

mb.on('ready', () => {
  console.log('Ready!')
  mb.tray.displayBaloon({
    title: 'Test blah blah',
    content: 'Content here'
  })
  // initTrayMenu()
})

// app.on('window-all-closed', () => {})