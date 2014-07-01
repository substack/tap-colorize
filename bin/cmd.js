#!/usr/bin/env node

var colorize = require('../');
var fs = require('fs');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
    alias: { i: 'infile', o: 'outfile' },
    default: { infile: '-', outfile: '-' }
});

var input = argv.infile === '-'
    ? process.stdin
    : fs.createReadStream(argv.infile)
;
var output = argv.outfile === '-'
    ? process.stdout
    : fs.createWriteStream(argv.outfile)
;
input.pipe(colorize(argv)).pipe(output);
