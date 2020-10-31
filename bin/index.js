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
    var firebaseOutput = response.stderr.match(errorRegex) || [];
    var count = 0

    while (firebaseOutput.length > 0) {
        // Get the command to execute provided by Firebase
        const command = textResponse.match(commandRegex) || [];
        if (command.length > 0) {
            await sleep(pause);
            response = shell.exec(command[0]);
            firebaseOutput = response.stderr.match(errorRegex) || [];
        } else {
            log('Couldn\'t find any errors with the deploy, exiting.');
            return;
        }
        count += 1;

        if (count >= maxRetries) {
            log('Reached maximum retries, exiting.');
            return
        }
    }

    log('Deploy was successful, exiting.');
    return;
}

function log(message) {
    console.log(chalk.magenta('deploy-firebase-functions 🚀: ') + message);
}

const textResponse = `
    Example Firebase deploy errors


    i deploying functions
    Running command: npm--prefix. / functions / run build

        >
        functions @ build / Users / michaelrichardson / Documents / GitLive / Development / firebase / functions >
        tsc - p tsconfig.lib.json

    ✔ functions: Finished running predeploy script.
    i functions: ensuring required API cloudfunctions.googleapis.com is enabled...
        i functions: ensuring required API cloudbuild.googleapis.com is enabled...✔functions: required API cloudbuild.googleapis.com is enabled✔ functions: required API cloudfunctions.googleapis.com is enabled
    i functions: preparing functions directory
    for uploading...
        i functions: packaged functions(841.35 KB) for uploading✔ functions: functions folder uploaded successfully
    i functions: updating Node.js 10
    function getRevision(us - central1)...
    i functions: updating Node.js 10
    function syncTeam(us - central1)...
    i functions: updating Node.js 10
    function runGitlabSyncTeam(us - central1)...
    i functions: updating Node.js 10
    function mergeUsers(us - central1)...
    i functions: updating Node.js 10
    function onUserChangedFile(us - central1)...
    i functions: updating Node.js 10
    function onUserHostsEditingSession(us - central1)...
    i functions: updating Node.js 10
    function onCreatePresence(us - central1)...
    i functions: updating Node.js 10
    function onDeletePresence(us - central1)...
    i functions: updating Node.js 10
    function onCreateUser(us - central1)...
    i functions: updating Node.js 10
    function onUpdateUserRepositories(us - central1)...
    i functions: updating Node.js 10
    function onDeleteUserAccount(us - central1)...
    i functions: updating Node.js 10
    function onCreateWorkingCopy(us - central1)...
    i functions: updating Node.js 10
    function onUpdateWorkingCopy(us - central1)...
    i functions: updating Node.js 10
    function onWriteAccount(us - central1)...
    i functions: updating Node.js 10
    function onDeleteAccount(us - central1)...
    i functions: updating Node.js 10
    function onAuthUserCreated(us - central1)...
    i functions: updating Node.js 10
    function onWriteRepository(us - central1)...
    i functions: updating Node.js 10
    function onCreateInstallation(us - central1)...
    i functions: updating Node.js 10
    function onUpdateInstallation(us - central1)...
    i functions: updating Node.js 10
    function onDeleteInstallation(us - central1)...
    i functions: updating Node.js 10
    function onDeleteRepository(us - central1)...
    i functions: updating Node.js 10
    function onDeleteUser(us - central1)...
    i functions: updating Node.js 10
    function onDeleteWorkingCopy(us - central1)...
    i functions: updating Node.js 10
    function installIssueTracker(us - central1)...
    i functions: updating Node.js 10
    function selfHostedInstallation(us - central1)...
    i functions: updating Node.js 10
    function isAccessibleFromInternet(us - central1)...
    i functions: updating Node.js 10
    function reportRealtimeDatabaseIssue(us - central1)...
    i functions: updating Node.js 10
    function reportFirestoreIssue(us - central1)...
    i functions: updating Node.js 10
    function updateBitbucketAccess(us - central1)...
    i functions: updating Node.js 10
    function updateGitlabAccess2(us - central1)...
    i functions: updating Node.js 10
    function updateAzureAccess(us - central1)...
    i functions: updating Node.js 10
    function githubWebhook(us - central1)...
    i functions: updating Node.js 10
    function updateGitHubAccess(us - central1)...
    i functions: updating Node.js 10
    function updateGitHubIssues(us - central1)...
    i functions: updating Node.js 10
    function bitbucketWebhook(us - central1)...
    i functions: updating Node.js 10
    function githubAuthorization(us - central1)...
    i functions: updating Node.js 10
    function githubInstallation(us - central1)...
    i functions: updating Node.js 10
    function bitbucketAuthorization(us - central1)...
    i functions: updating Node.js 10
    function bitbucketInstalled(us - central1)...
    i functions: updating Node.js 10
    function bitbucketUninstalled(us - central1)...
    i functions: updating Node.js 10
    function bitbucketInstallation(us - central1)...
    i functions: updating Node.js 10
    function bitbucketDescriptor(us - central1)...
    i functions: updating Node.js 10
    function bitbucketIssues(us - central1)...
    i functions: updating Node.js 10
    function gitlabRedirect(us - central1)...
    i functions: updating Node.js 10
    function gitlabWebhook(us - central1)...
    i functions: updating Node.js 10
    function gitlabAuthorization(us - central1)...
    i functions: updating Node.js 10
    function gitlabInstall(us - central1)...
    i functions: updating Node.js 10
    function gitlabInstallation(us - central1)...
    i functions: updating Node.js 10
    function updateGitLabIssues(us - central1)...
    i functions: updating Node.js 10
    function jiraRedirect(us - central1)...
    i functions: updating Node.js 10
    function jiraAuthorization(us - central1)...
    i functions: updating Node.js 10
    function jiraDescriptor(us - central1)...
    i functions: updating Node.js 10
    function jiraInstalled(us - central1)...
    i functions: updating Node.js 10
    function jiraUninstalled(us - central1)...
    i functions: updating Node.js 10
    function jiraInstallation(us - central1)...
    i functions: updating Node.js 10
    function jiraWebhook(us - central1)...
    i functions: updating Node.js 10
    function jiraIssues(us - central1)...
    i functions: updating Node.js 10
    function azureRedirect(us - central1)...
    i functions: updating Node.js 10
    function azureAuthorization(us - central1)...
    i functions: updating Node.js 10
    function azureInstall(us - central1)...
    i functions: updating Node.js 10
    function azureInstallation(us - central1)...
    i functions: updating Node.js 10
    function azureWebhook(us - central1)...
    i functions: updating Node.js 10
    function azureIssues(us - central1)...
    i scheduler: ensuring required API cloudscheduler.googleapis.com is enabled...
        i pubsub: ensuring required API pubsub.googleapis.com is enabled...✔pubsub: required API pubsub.googleapis.com is enabled✔ scheduler: required API cloudscheduler.googleapis.com is enabled
    i functions: scheduler job firebase - schedule - runGitlabSyncTeam - us - central1 is up to date, no changes required⚠ functions[azureRedirect(us - central1)]: Deployment error.
    You have exceeded your deployment quota, please deploy your functions in batches by using the--only flag, and wait a few minutes before deploying again.Go to https: //firebase.google.com/docs/cli/#deploy_specific_functions to learn more.
        ⚠functions[bitbucketDescriptor(us - central1)]: Deployment error.
    You have exceeded your deployment quota, please deploy your functions in batches by using the--only flag, and wait a few minutes before deploying again.Go to https: //firebase.google.com/docs/cli/#deploy_specific_functions to learn more.
        ⚠functions[azureWebhook(us - central1)]: Deployment error.
    You have exceeded your deployment quota, please deploy your functions in batches by using the--only flag, and wait a few minutes before deploying again.Go to https: //firebase.google.com/docs/cli/#deploy_specific_functions to learn more.
        ⚠functions[jiraWebhook(us - central1)]: Deployment error.
    You have exceeded your deployment quota, please deploy your functions in batches by using the--only flag, and wait a few minutes before deploying again.Go to https: //firebase.google.com/docs/cli/#deploy_specific_functions to learn more.
        ⚠functions[onCreateUser(us - central1)]: Deployment error.
    You have exceeded your deployment quota, please deploy your functions in batches by using the--only flag, and wait a few minutes before deploying again.Go to https: //firebase.google.com/docs/cli/#deploy_specific_functions to learn more.
        ✔functions[jiraInstalled(us - central1)]: Successful update operation.✔functions[onCreatePresence(us - central1)]: Successful update operation.✔functions[gitlabInstall(us - central1)]: Successful update operation.✔functions[reportFirestoreIssue(us - central1)]: Successful update operation.✔functions[jiraInstallation(us - central1)]: Successful update operation.✔functions[onDeletePresence(us - central1)]: Successful update operation.✔functions[gitlabAuthorization(us - central1)]: Successful update operation.✔functions[bitbucketUninstalled(us - central1)]: Successful update operation.✔functions[onUpdateInstallation(us - central1)]: Successful update operation.✔functions[onUpdateUserRepositories(us - central1)]: Successful update operation.✔functions[onDeleteAccount(us - central1)]: Successful update operation.✔functions[installIssueTracker(us - central1)]: Successful update operation.✔functions[getRevision(us - central1)]: Successful update operation.✔functions[selfHostedInstallation(us - central1)]: Successful update operation.✔functions[bitbucketWebhook(us - central1)]: Successful update operation.✔functions[gitlabInstallation(us - central1)]: Successful update operation.✔functions[azureIssues(us - central1)]: Successful update operation.✔functions[bitbucketIssues(us - central1)]: Successful update operation.✔functions[githubWebhook(us - central1)]: Successful update operation.✔functions[onDeleteWorkingCopy(us - central1)]: Successful update operation.✔functions[runGitlabSyncTeam(us - central1)]: Successful update operation.✔functions[azureAuthorization(us - central1)]: Successful update operation.✔functions[mergeUsers(us - central1)]: Successful update operation.✔functions[updateBitbucketAccess(us - central1)]: Successful update operation.✔functions[onDeleteUser(us - central1)]: Successful update operation.✔functions[azureInstallation(us - central1)]: Successful update operation.✔functions[updateGitlabAccess2(us - central1)]: Successful update operation.✔functions[syncTeam(us - central1)]: Successful update operation.✔functions[onWriteAccount(us - central1)]: Successful update operation.✔functions[onDeleteRepository(us - central1)]: Successful update operation.✔functions[onAuthUserCreated(us - central1)]: Successful update operation.✔functions[onUserHostsEditingSession(us - central1)]: Successful update operation.✔functions[jiraDescriptor(us - central1)]: Successful update operation.✔functions[onWriteRepository(us - central1)]: Successful update operation.✔functions[onCreateWorkingCopy(us - central1)]: Successful update operation.✔functions[onUserChangedFile(us - central1)]: Successful update operation.✔functions[updateGitHubAccess(us - central1)]: Successful update operation.✔functions[gitlabRedirect(us - central1)]: Successful update operation.✔functions[jiraIssues(us - central1)]: Successful update operation.✔functions[jiraRedirect(us - central1)]: Successful update operation.✔functions[bitbucketInstalled(us - central1)]: Successful update operation.✔functions[githubInstallation(us - central1)]: Successful update operation.✔functions[updateGitHubIssues(us - central1)]: Successful update operation.✔functions[isAccessibleFromInternet(us - central1)]: Successful update operation.✔functions[jiraAuthorization(us - central1)]: Successful update operation.✔functions[gitlabWebhook(us - central1)]: Successful update operation.✔functions[onUpdateWorkingCopy(us - central1)]: Successful update operation.✔functions[jiraUninstalled(us - central1)]: Successful update operation.✔functions[onDeleteInstallation(us - central1)]: Successful update operation.✔functions[onDeleteUserAccount(us - central1)]: Successful update operation.✔functions[updateGitLabIssues(us - central1)]: Successful update operation.✔functions[reportRealtimeDatabaseIssue(us - central1)]: Successful update operation.✔functions[bitbucketAuthorization(us - central1)]: Successful update operation.✔functions[azureInstall(us - central1)]: Successful update operation.✔functions[updateAzureAccess(us - central1)]: Successful update operation.✔functions[bitbucketInstallation(us - central1)]: Successful update operation.✔functions[onCreateInstallation(us - central1)]: Successful update operation.✔functions[githubAuthorization(us - central1)]: Successful update operation.


    Functions deploy had errors with the following functions:
        azureRedirect
    azureWebhook
    bitbucketDescriptor
    jiraWebhook
    onCreateUser


    To
    try redeploying those functions, run:
        firebase deploy --only "functions:azureRedirect,functions:azureWebhook,functions:bitbucketDescriptor,functions:jiraWebhook,functions:onCreateUser"


    To
    continue deploying other features(such as database), run:
        firebase deploy --except functions
`

runDeployCommands(argv);