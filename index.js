var split = require('split');
var through = require('through2');
var combine = require('stream-combiner');
var x256 = require('x256');

module.exports = function (opts) {
    if (!opts) opts = {};
    var pass = color(opts.pass || [0,255,0]);
    var fail = color(opts.fail || [255,0,0]);
    var info = color(opts.info || [91,127,127]);
    var reset = opts.reset || '\x1b[00m';
    
    var buffered = '';
    var inyaml = false, level = null;
    
    return combine(split(), through(write, end));
    
    function write (buf, enc, next) {
        var line = buf.toString('utf8');
        if (/^TAP version|^#|^1..\d+$|^\s+(---|...)$/i.test(line)) {
            this.push(buffered + reset + info + '\n');
            buffered = line;
        }
        else if (/^ok\s+/.test(line)) {
            this.push(buffered + reset + pass + '\n');
            buffered = line;
        }
        else if (/^not ok\s+/.test(line)) {
            this.push(buffered + reset + fail + '\n');
            buffered = line;
        }
        else {
            this.push(buffered + reset + '\n');
            buffered = line;
        }
        next();
    }
    function end () {
        this.push(buffered + reset + '\n');
        this.push(null);
    }
};

function color (s) {
    if (typeof s === 'string') return s;
    return '\x1b[38;5;' + x256(s) + 'm';
}
