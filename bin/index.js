#!/usr/bin/env node
const fs = require('fs');
const indexFile = `${process.cwd()}/index.ts`
console.log('Using file:', indexFile);
console.log();

if (!fs.existsSync(indexFile)) {
    console.log(`File (${indexFile}) does not exist`);
    return;
}

try {
    // read contents of the file
    const data = fs.readFileSync(indexFile, 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);
    const functions = [];

    // print all lines
    lines.forEach((line) => {
        if (line.includes('export')) {
            const matches = line.match(/(?<=\{).+?(?=\})/g) || [];
            if (matches.length > 0) {
                const ex = matches[0].trim().split(',') || [];
                if (ex.length > 0) {
                    ex.forEach(e => {
                        if (e.includes(' as ')) {
                            functions.push(e.split(' as ')[1].trim());
                        } else {
                            functions.push(e.trim());
                        }
                    });
                }
            }
        }
    });

    console.log('Number of functions:', functions.length);
    const firebaseCmd = 'firebase deploy --only ';
    let cmd = firebaseCmd;
    for (const [idx, func] of functions.entries()) {
        // console.log('Add', idx);
        cmd += `functions:${func}`;

        if ((idx + 1) % 10 == 0 || idx + 1 == functions.length) {
            console.log('Uploading functions...');
            console.log(cmd);
            console.log();
            cmd = firebaseCmd;
        } else {
            cmd += ',';
        }
    }
} catch (err) {
    console.error(err);
}