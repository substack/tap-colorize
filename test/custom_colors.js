var test = require('tape');
var parser = require('tap-parser');
var colorize = require('../');
var concat = require('concat-stream');
var quotemeta = require('quotemeta');

var hexCode = require('colornames');
var x256 = require('x256');

test('custom colors', function (t) {
    t.plan(3);
    
    var purple = code('purple');
    var gold = '\x1b[38;5;' + x256([230,200,30]);
    var blue = '\x1b[38;5;' + x256([30,80,220]);
    
    var th = test.createHarness();
    th.createStream()
        .pipe(colorize({
            pass: 'purple',
            fail: [ 230, 200, 30 ],
            info: '#1e50dc'
        }))
        .pipe(concat(function (body) {
            var str = body.toString('utf8');
            t.equal(str.match(RegExp(quotemeta(purple), 'g')).length, 1);
            t.equal(str.match(RegExp(quotemeta(gold), 'g')).length, 1);
            t.ok(str.match(RegExp(quotemeta(blue), 'g')).length > 3);
        }))
    ;
    
    th(function (tt) {
        tt.plan(2);
        tt.equal(1+1, 2);
        tt.deepEqual([1,2,3], [1,3,2]);
    });
});

function code (s) {
    var c = x256(hexCode(s).match(/\w{2}/g).map(fromHex));
    return '\x1b[38;5;' + c;
}
function fromHex (s) { return parseInt(s, 16) }
