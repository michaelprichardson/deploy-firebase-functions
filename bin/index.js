#!/usr/bin/env node
const chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var shell = require('shelljs');
var path = require('path');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDeployCommands(args) {
    if (args.h || args.help) {
        console.log(chalk.magenta('deploy-firebase-functions: '));
        console.log();
        console.log('available arguments:');
        console.log('   --retry (bool) This will try a re-deploy the failed functions until it succeeds (Max retried is 10)');
        console.log('   --index (string) This is the file exporting all the files for Firebase. Defaults to functions/index.js');
        console.log('   --max (int) This is the maximum number of functions to deploy at once. Defaults to 10 (Max 10)');
        console.log('   --pause (int) This is the time (ms) to wait between each deploy. Defaults to 2500ms');
        console.log();
        console.log(chalk.red('Note: Typescript is not supported'));
        return;
    }

    // Assign the variables needed
    var retry = true;
    var maxRetries = 10;
    var filePath = 'functions/index.js';
    var maxFuncs = 5;
    var pause = 2500;
    if (args.retry) {
        retry = argv.retry;
    }
    if (args.index) {
        filePath = argv.index;
    }
    if (args.max) {
        maxFuncs = min(argv.max, 10);
    }
    if (args.pause) {
        pause = argv.pause;
    }

    

    if (retry) {
        console.log(`Deploying all functions at once and will retry until successful (max retries: ${maxRetries})`);

        const errorRegex = /(?<=\[)(.*?)(?=\(.*?\)\]: Deployment error.)/g;
        const commandRegex = /firebase deploy --only \".*\"/;
        var response = shell.exec('firebase deploy --only functions');
        var firebaseOutput = response.stdout;

        while (response.stdout.match(errorRegex).length > 0) {
            // Get the command to execute provided by Firebase
            const command = firebaseOutput.match(commandRegex);
            if (command.length > 0) {
                response = shell.exec(command[0]);
            } else {
                console.log('Couldn\'t find any error with the deploy, exiting.');
                return;
            }
        }
    } else {
        console.log('Processing functions in: ' + chalk.magenta(filePath));

        // Collect the functions from the index file
        const imports = require(path.join(process.cwd(), filePath));
        const funcNames = Object.keys(imports);

        console.log(`There ${funcNames.length === 1 ? 'is' : 'are'} ${chalk.magenta(funcNames.length)} function${funcNames.length === 1 ? '' : 's'} to deploy to Firebase!`);
        
        const deployCmd = 'firebase deploy --only ';
        const funcCmd = 'functions:';

        // Loop through all the functions and group them and build the command to execute
        var ii, jj, cmd = '';
        for (ii = 0, jj = funcNames.length; ii < jj; ii += maxFuncs) {
            const groupedNames = funcNames.slice(ii, ii + maxFuncs);

            for (var idx = 0; idx < groupedNames.length; idx++) {
                cmd += `${funcCmd}${groupedNames[idx]}${idx < groupedNames.length-1 ? ',' : ''}`;
            }
            const executeCommand = `${deployCmd}${cmd}`;
            console.log(`${chalk.magenta('Execute command:')} ${executeCommand}`);
            console.log(`${chalk.magenta('Firebase output: ')}`);
            const response = shell.exec(executeCommand);
            if (response.code !== 0) {
                return;
            }

            cmd = '';

            // Only pause if it is not the last command executed
            if (ii < funcNames.length - 1) {
                console.log(`Pausing for ${pause}ms`);
                await sleep(2500);
            }

        }
    }
}

runDeployCommands(argv);