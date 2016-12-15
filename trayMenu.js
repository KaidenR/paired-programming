import {Menu, Tray} from 'electron'
import firebase from 'firebase'

import showSettingsWindow from './settingsWindow'

let tray
let stationId = 'one'

export default function init() {
  // Icon found at: http://www.flaticon.com/free-icon/programming-code-signs_59118#term=code&page=2&position=15
  tray = new Tray('./icon.png')
  watchStationUsers()
}


async function watchStationUsers() {
  const settingsMenuItems = [
    {type:'separator'},
    {label: 'Settings', type: 'normal', click: showSettingsWindow},
  ]

  tray.setContextMenu(Menu.buildFromTemplate(settingsMenuItems))

  onStationUsersUpdate((allUsers, activeUserIds) => {
    const users = allUsers.map(u => ({ ...u, active: activeUserIds.hasOwnProperty(u.id)}))
    console.log('active users', users.filter(u => u.active).map(u => u.shortName))
    const menuItems = users
      .map(u => ({
        label: u.fullName,
        type: 'checkbox',
        checked: u.active,
        click: handleUserClick.bind(null, u)
      }))
      .concat(settingsMenuItems)
    tray.setContextMenu(Menu.buildFromTemplate(menuItems))
  })
}

function onStationUsersUpdate(callback) {
  let allUsers
  let activeUserIds
  firebase.database().ref(`stations/${stationId}/users`).on('value', async snapshot => {
    const allUserIds = Object.keys(snapshot.val())
    allUsers = await Promise.all(allUserIds.map(getUser))

    if(activeUserIds){
      callback(allUsers, activeUserIds)
    }
  })
  firebase.database().ref(`stationUsers/${stationId}`).on('value', async snapshot => {
    activeUserIds = snapshot.val()
    if(allUsers) {
      callback(allUsers, activeUserIds)
    }
  })
}

function handleUserClick(user) {
  console.log('clicked', user)
  firebase.database().ref(`stationUsers/${stationId}/${user.id}`).set(user.active ? null : true)
}

// async function getUsers() {
//   console.log('getting users...')
//   try {
//     const snapshot = await firebase.database().ref('stationUsers/one').once('value')
//     const stationUsers = Object.keys(snapshot.val())
//
//     const users = await Promise.all(stationUsers.map(getUser))
//     console.log('users', users)
//
//   } catch(err) {
//     console.error(err)
//   }
// }

async function getUser(id) {
  const info = (await firebase.database().ref(`users/${id}`).once('value')).val()
  return { ...info, id }
}
