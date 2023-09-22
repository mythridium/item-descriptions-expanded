# Item Descriptions Expanded

This mod is a community effort to add item descriptions to all items in the game.

![Description](images/description.png)

Translations for all descriptions have been obtained through chat-gpt, they may be incorrect.

## Description Contributors
- TheRealOsamaru

## Dependencies
Download and install NodeJS https://nodejs.org/en The latest LTS version is fine.

### Game Data Files
Next we need to get the games data files locally so we can look up the correct item id's and pieces things together.

Create a new folder named `game-data` in the `data` folder.

Copy the json from the following urls:
* https://melvoridle.com/assets/data/melvorDemo.json
* https://melvoridle.com/assets/data/melvorFull.json
* https://melvoridle.com/assets/data/melvorTotH.json
* https://melvoridle.com/assets/data/melvorExpansion2.json

And paste the contents into json files named:
* melvorD.json
* melvorF.json
* melvorTotH.json
* melvorAoD.json

## How to Contribute

Add new volumes to `data/volumes` in the following format:

```
Item Name - Description
```

Import and add the new volume to `data/volumes/index.mts`

Run the `npm run generate` command to automatically generate the `json` and `english` translation files.

No grab the english key/values and feed them through Chat-GPT to update all the other languages. ()

### Setup
- Fork this git repo
- Clone your fork locally
- Open the folder in VS Code
- In the terminal run `npm i` to download the required npm packages
- Run `npm run build` to compile the application
- You'll find the zip in the build folder which you can add to the Creator's Toolkit mod for local testing
- Once all your changes are done, commit to your branch, push it to the server and open a pull request from your repo into this repo
- Once the PR has been reviewed, it will get approved which merges into this repo (you can freely delete your fork if you no longer want it)
- At this point, I'll run `npm run build` on my machine and upload the zip to mod.io
