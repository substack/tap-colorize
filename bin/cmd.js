#!/usr/bin/env node

var colorize = require('../');
var fs = require('fs');
var minimist = require('minimist');
var through = require('through2');

var argv = minimist(process.argv.slice(2), {
    alias: {
        v: 'version', h: 'help',
        i: 'infile', o: 'outfile'
    },
    default: { infile: '-', outfile: '-' }
});

if (argv.help) {
    fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout);
    ;
    return;
}
if (argv.version) {
    console.log(require('../package.json').version);
    return;
}

var input = argv.infile === '-'
    ? process.stdin
    : fs.createReadStream(argv.infile)
;
var output = argv.outfile === '-'
    ? process.stdout
    : fs.createWriteStream(argv.outfile)
;

var failures = false;
input
    .pipe(through(function(chunk, enc, callback){
        var line = chunk.toString('utf-8');
        if (/^not ok\s/.test(line)){
            failures = true;
        }
        callback(null, chunk);
    }))
    .pipe(colorize(argv))
    .on('end', function(){
        // Report if any tests failed
        process.exit(failures ? 1 : 0);
    })
    .pipe(output);
