# deploy-firebase-functions# deploy-firebase-functions CLI 🚀

[![license](https://img.shields.io/npm/v/deploy-firebase-functions)](https://www.npmjs.com/package/deploy-firebase-functions)
[![license](https://img.shields.io/github/license/michaelprichardson/deploy-firebase-functions)](https://github.com/michaelprichardson/deploy-firebase-functions/blob/master/LICENSE)

This package was designed help deploy more than [10 firebase functions](https://firebase.google.com/docs/functions/manage-functions#deploy_functions) at a time. It's extremely easy to use and just wraps the firebase-tool CLI and automically creates the commands to deploy 10 functions at a time.

### Installation

Node Package
You can install the deploy-firebase-functions CLI using npm (the Node Package Manager). Note that you will need to install Node.js and npm. Installing Node.js should install npm as well.

To download and install the CLI run the following command:
```sh
npm install -g firebase-tools
```
This will provide you with the globally accessible `deploy-firebase-functions` command.

### Commands

The command `deploy-firebase-functions --help` lists the available commands.

Below is a brief list of the available commands and their function:

| Command  | Description  |
|---|---|
| index |This is used to set the path of the index.js file (TypeScript not supported yet) that exports the functions from the current working directory (Default `functions/index.js`)|
| max  |The max number of functions to run in each deploy (Default 10)|
| pause |The time to wait bewteen each deploy in ms (Default 2500ms)|
| help |Show the help dialog|

### Contributions

I encourage you to submit a PR extending the functionality or submit an issue requesting something!