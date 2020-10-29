#!/usr/bin/env node
const chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var shell = require('shelljs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDeployCommands(args) {
    if (args.h || args.help) {
        console.log('Use the argument --index to provide the file that exports the Firebase functions. If no supplied it defaults to functions/index.js');
        console.log(chalk.red('Note: Typescript is not supported'));
        return;
    }

    var filePath = 'functions/index.js';
    var maxFuncs = 2;
    var pause = 2500;
    if (args.index) {
        filePath = argv.index;
    }

    if (args.max) {
        maxFuncs = argv.max;
    }

    console.log('Processing functions in: ' + chalk.magenta(filePath));

    const imports = require(filePath);
    const funcNames = Object.keys(imports);

    console.log(`There ${funcNames.length === 1 ? 'is' : 'are'} ${chalk.magenta(funcNames.length)} function${funcNames.length === 1 ? '' : 's'} to deploy to Firebase!`);

    const deployCmd = 'firebase deploy --only ';
    const funcCmd = 'functions:';

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

        if (ii < funcNames.length - 1) {
            console.log(`Pausing for ${pause}ms`);
            await sleep(2500);
        }
        
    }
}

runDeployCommands(argv);