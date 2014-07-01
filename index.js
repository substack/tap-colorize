var split = require('split');
var through = require('through2');
var combine = require('stream-combiner');
var x256 = require('x256');
var hexCode = require('colornames');

module.exports = function (opts) {
    if (!opts) opts = {};
    
    var pass = color(opts.pass || 'bright green');
    var fail = color(opts.fail || 'bright red');
    var info = color(opts.info || [ 'dim', [91,127,127] ]);
    var reset = opts.reset || '\x1b[00m';
    
    var buffered = '';
    var inyaml = false, level = null;
    
    var stream = combine(split(), through(write, end));
    stream.mode = null;
    return stream;
    
    function write (buf, enc, next) {
        var line = buf.toString('utf8');
        if (/^TAP version|^#\s+|^1..\d+$|^\s+(---|...)$/i.test(line)) {
            stream.mode = info;
            this.push(buffered + reset + stream.mode + '\n');
            buffered = line + reset;
        }
        else if (/^ok\s+/.test(line)) {
            stream.mode = pass;
            this.push(buffered + reset + stream.mode + '\n');
            buffered = line + reset;
        }
        else if (/^not ok\s+/.test(line)) {
            stream.mode = fail;
            this.push(buffered + reset + stream.mode + '\n');
            buffered = line + reset;
        }
        else {
            stream.mode = null;
            this.push(buffered + '\n');
            buffered = line;
        }
        next();
    }
    function end () {
        this.push(buffered + '\n');
        this.push(null);
    }
};

function color (parts) {
    if (typeof parts === 'string') parts = parts.split(/\s+/);
    if (typeof parts === 'object' && /^\d+$/.test(parts[0])) {
        parts = [ parts ];
    }
    
    var s = '';
    for (var i = 0; i < parts.length; i++) {
        var c = {
            bright: 1, dim: 2, underscore: 4, blink: 5,
            reverse: 7, hidden: 8
        }[parts[i]];
        
        if (c) s += '\x1b[' + c + 'm'
        else s += parseColor(parts[i])
    }
    return s;
}

function parseColor (rgb) {
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
    var xs = s.replace(/^#/, '').match(/\w{2}/g);
    var res = [];
    for (var i = 0; i < xs.length; i++) res.push(fromHex(xs[i]));
    return res;
}
