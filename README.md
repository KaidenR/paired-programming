# paired-programming
An Electron App for managing users on pairing stations


## Installation
1. Clone the repo
2. Run `npm install`
3. Add this post-commit hook to your repo:
```
#!/bin/sh

pairing_station_id="one"

committer="$(git log --format='%ae' -1 HEAD)"
curl -X PUT -s -d "\"${committer}\"" "https://pairedprogramming.firebaseio.com/stations/${pairing_station_id}/lastCommitAuthor.json" > /dev/null
```

## Usage
1. Run `npm start`
2. Click on the icon in the system menu bar (it looks like this: `</>`)
3. Select the users who are working on the pairing station
