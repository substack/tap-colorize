var split = require('split');
var through = require('through2');
var combine = require('stream-combiner');
var x256 = require('x256');
var hexCode = require('colornames');

module.exports = function (opts) {
    if (!opts) opts = {};
    var pass = color(opts.pass || 'green');
    var fail = color(opts.fail || 'red');
    var info = color(opts.info || [91,127,127]);
    var reset = opts.reset || '\x1b[00m';
    
    var buffered = '';
    var inyaml = false, level = null;
    
    return combine(split(), through(write, end));
    
    function write (buf, enc, next) {
        var line = buf.toString('utf8');
        if (/^TAP version|^#\s+|^1..\d+$|^\s+(---|...)$/i.test(line)) {
            this.push(buffered + reset + info + '\n');
            buffered = line + reset;
        }
        else if (/^ok\s+/.test(line)) {
            this.push(buffered + reset + pass + '\n');
            buffered = line + reset;
        }
        else if (/^not ok\s+/.test(line)) {
            this.push(buffered + reset + fail + '\n');
            buffered = line + reset;
        }
        else {
            this.push(buffered + '\n');
            buffered = line;
        }
        next();
    }
    function end () {
        this.push(buffered + reset + '\n');
        this.push(null);
    }
};

function color (rgb) {
    if (typeof rgb === 'string' && /,/.test(rgb)) {
        rgb = rgb.split(',');
    }
    else if (typeof rgb === 'string' && /^#/.test(rgb)) {
        rgb = parseHex(rgb);
    }
    else if (typeof rgb === 'string') {
        rgb = hexCode(rgb);
        if (rgb) rgb = parseHex(rgb)
        else rgb = [ 127, 127, 127 ]
    }
    return '\x1b[38;5;' + x256(rgb) + 'm';
}

function fromHex (s) {
    return parseInt(s, 16);
}

function parseHex (s) {
    return s.replace(/^#/, '').match(/\w{2}/g).map(fromHex);
}
