const fs = require('fs');
const process = require('process');
const axios = require('axios');

// handle output: write to file if '--out' is present, if not, print

function handleOutput(text, out) {
    if (out) {
        fs.writeFile(out, text, 'utf8', function(err) {
            if (err) {
                console.error(`Couldn't write ${out}: ${err}`);
                process.exit(1);
            } 
        });
    } else {
        console.log(text);
    }
}

function cat(path, out) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            console.log(`ERROR READING ${path}: ${err}`);
            process.exit(1);
        } else {
            handleOutput(data, out);
        }
    });
}

// cat(process.argv[2])

async function webCat(url, out) {
    try {
        let resp = await axios.get(url);
        handleOutput(resp.data, out);
    } catch (err) {
        console.log(`ERROR FETCHING ${url}: ${err}`);
        process.exit(1);
    } 
}
let path;
let out;

if (process.argv[2] === '--out') {
    out = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.slice(0,4) === 'http'){
    webCat(path, out)
} else {
    cat(path, out);
}