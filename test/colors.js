var test = require('tape');
var parser = require('tap-parser');
var colorize = require('../');
var concat = require('concat-stream');
var quotemeta = require('quotemeta');

var hexCode = require('colornames');
var x256 = require('x256');

test('default pass color', function (t) {
    t.plan(2);
    
    var green = code('green');
    var red = code('red');
    
    var th = test.createHarness();
    th.createStream()
        .pipe(colorize())
        .pipe(concat(function (body) {
            var str = body.toString('utf8');
            t.equal(str.match(RegExp(quotemeta(green), 'g')).length, 2);
            t.equal(str.match(RegExp(quotemeta(red), 'g')), null);
        }))
    ;
    
    th(function (tt) {
        tt.plan(2);
        tt.equal(1+1, 2);
        tt.deepEqual([1,2,3], [1,2,3]);
    });
});

test('default fail color', function (t) {
    t.plan(2);
    
    var green = code('green');
    var red = code('red');
    
    var th = test.createHarness();
    th.createStream()
        .pipe(colorize())
        .pipe(concat(function (body) {
            var str = body.toString('utf8');
            t.equal(str.match(RegExp(quotemeta(green), 'g')).length, 1);
            t.equal(str.match(RegExp(quotemeta(red), 'g')).length, 1);
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
