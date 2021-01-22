#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var shell = require('shelljs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDeployCommands(args) {
    if (args.h || args.help) {
        console.log();
        console.log('Available arguments:');
        console.log('   --pause (int) This is the time (ms) to wait between each deploy. Defaults to 10000ms');
        console.log('   --cmd (string) The command to run in firebase deploy. Defaults to "--deploy"');
        console.log();
        return;
    }

    // Assign the variables needed
    var cmd = 'deploy';
    var pause = 10000;

    if (args.cmd) {
        cmd = argv.cmd;
    }
    if (args.pause) {
        pause = argv.pause;
    }

    let command = `firebase ${cmd}`;
    console.log(`Running command: ${command}`);

    let response = shell.exec(command);
    // Get the output from the command
    const errorMessage = response.stdout || response.stderr || '';

    // Find if there is a match for the firebase functions deploy error
    // TODO: This could be in a loop until there is nothing in the match
    const functionDeployErrorRegex = /(firebase deploy--only\ ".*\")/g;
    const errorMatch = errorMessage.match(functionDeployErrorRegex) || [];
    if (errorMatch.length > 0) {
        command = errorMatch[0];
        console.log('There was an error deploying');

        // Wait a bit before running the command again
        await sleep(pause);
        console.log(`Running command: ${command}`);
        response = shell.exec(command);
    }

    if (response.code === 0) {
        console.log(`Deploy was successful 🚀, exiting [${response.code}]`);
    } else {
        console.log(`Deploy failed ❌, exiting [${response.code}]`);
    }
    return;
}

runDeployCommands(argv);