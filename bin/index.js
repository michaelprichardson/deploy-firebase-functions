#!/usr/bin/env node
const chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var shell = require('shelljs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDeployCommands(args) {
    if (args.h || args.help) {
        log('');
        console.log();
        console.log('available arguments:');
        console.log('   --delete (boolean) This will add the flag `--force` to the Firebase deploy command (Default false)');
        console.log('   --max (int) This is the maximum number of functions to deploy at once. Defaults to 10 (Max 10)');
        console.log('   --pause (int) This is the time (ms) to wait between each deploy. Defaults to 2500ms');
        console.log();
        console.log(chalk.red('Note: Typescript is not supported'));
        return;
    }

    // Assign the variables needed
    var forceDelete = false;
    var maxRetries = 10;
    var pause = 2500;

    if (args.delete) {
        forceDelete = argv.delete;
    }
    if (args.max) {
        maxRetries = min(argv.max, 10);
    }
    if (args.pause) {
        pause = argv.pause;
    }

    log(`Deploying all functions at once and will retry until successful (max retries: ${maxRetries})`);

    const errorRegex = /(?<=\[)(.*?)(?=\(.*?\)\]: Deployment error.)/g;
    const commandRegex = /(firebase deploy --only \".*\")/g;
    var response = shell.exec(`firebase deploy --only functions ${forceDelete ? '--force ' : ''}`);
    var firebaseOutput = response.stdout.match(errorRegex) || response.stderr.match(errorRegex) || [];
    var count = 0

    while (response.code !== 0 && firebaseOutput.length > 0) {
        // Get the command to execute provided by Firebase
        const command = response.stdout.match(commandRegex) || response.stderr.match(commandRegex) || [];
        if (command.length > 0) {
            await sleep(pause);
            response = shell.exec(command[0]);
            firebaseOutput = response.stdout.match(errorRegex) || response.stderr.match(errorRegex) || [];
        } else {
            log(`Couldn't find any errors with the deploy, exiting. [${response.code}]`);
            return;
        }
        count += 1;

        if (count >= maxRetries) {
            log('Reached maximum retries, exiting.');
            return
        }
    }

    log(`Deploy was successful, exiting. [${response.code}]`);
    return;
}

function log(message) {
    console.log(chalk.magenta('deploy-firebase-functions 🚀: ') + message);
}

runDeployCommands(argv);