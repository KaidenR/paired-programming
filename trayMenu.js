import { Menu, Tray } from 'electron'
import firebase from 'firebase'
import { exec } from 'child_process'

import showSettingsWindow from './settingsWindow'

let tray
let stationId = 'one'

export default function init() {
  // Icon found at: http://www.flaticon.com/free-icon/programming-code-signs_59118#term=code&page=2&position=15
  tray = new Tray('./iconTemplate.png')
  watchStationUsers()
}

function watchStationUsers() {
  const settingsMenuItems = [
    {type:'separator'},
    {label: 'Settings', type: 'normal', click: showSettingsWindow},
  ]

  tray.setContextMenu(Menu.buildFromTemplate(settingsMenuItems))

  onStationUsersUpdate(async (allUsers, activeUserIds, lastCommitAuthor) => {
    const users = allUsers.map(u => ({ ...u, active: activeUserIds.hasOwnProperty(u.id)}))

    const menuItems = users
      .map(u => ({
        label: u.fullName,
        type: 'checkbox',
        checked: u.active,
        click: handleUserClick.bind(null, u)
      }))
      .concat(settingsMenuItems)

    tray.setContextMenu(Menu.buildFromTemplate(menuItems))

    try {
      await updateGitUser(users, lastCommitAuthor)
    } catch(err) {
      console.error(err)
    }
  })
}

function onStationUsersUpdate(callback) {
  let allUsers
  let lastCommitAuthor
  let activeUserIds

  firebase.database().ref(`stations/${stationId}`).on('value', async snapshot => {
    const station = snapshot.val()
    const allUserIds = Object.keys(station.users)
    allUsers = await Promise.all(allUserIds.map(getUser))
    lastCommitAuthor = station.lastCommitAuthor

    if(activeUserIds){
      callback(allUsers, activeUserIds, lastCommitAuthor)
    }
  })

  firebase.database().ref(`stationUsers/${stationId}`).on('value', async snapshot => {
    activeUserIds = snapshot.val()
    if(allUsers) {
      callback(allUsers, activeUserIds, lastCommitAuthor)
    }
  })
}

function handleUserClick(user) {
  firebase.database().ref(`stationUsers/${stationId}/${user.id}`).set(user.active ? null : true)
}

async function getUser(id) {
  const info = (await firebase.database().ref(`users/${id}`).once('value')).val()
  return { ...info, id }
}

async function updateGitUser(users, lastCommitAuthor) {
  const activeUsers = users.filter(u => u.active)

  const nextCommitAuthorIndex = (activeUsers.map(u => u.email).indexOf(lastCommitAuthor) + 1) % activeUsers.length
  const nextCommitAuthor = activeUsers[nextCommitAuthorIndex]

  const name = [nextCommitAuthor.fullName]
    .concat(activeUsers.filter(u => u.id !== nextCommitAuthor.id).map(u => u.fullName))
    .join(', ')

  exec(`git config --global user.name "${name}"`)
  exec(`git config --global user.email "${nextCommitAuthor.email}"`)
}