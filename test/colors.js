var test = require('tape');
var parser = require('tap-parser');
var colorize = require('../');

test('colorize pass', function (t) {
    t.plan(5);
    var th = test.createHarness();
    th.createStream().pipe(colorize())
        .pipe(parser(function (results) {
            t.equal(results.ok, true);
            t.equal(results.asserts.length, 2);
            t.equal(results.fail.length, 0);
            t.equal(results.pass.length, 2);
            t.deepEqual(results.plan, { start: 1, end: 2 });
        }))
    ;
    
    th(function (tt) {
        tt.plan(2);
        tt.equal(1+1, 2);
        tt.deepEqual([1,2,3], [1,2,3]);
    });
});

test('colorize fail', function (t) {
    t.plan(5);
    var th = test.createHarness();
    th.createStream().pipe(colorize())
        .pipe(parser(function (results) {
            t.equal(results.ok, false);
            t.equal(results.asserts.length, 2);
            t.equal(results.fail.length, 1);
            t.equal(results.pass.length, 1);
            t.deepEqual(results.plan, { start: 1, end: 2 });
        }))
    ;
    
    th(function (tt) {
        tt.plan(2);
        tt.equal(1+1, 2);
        tt.deepEqual([1,2,3], ['1',2,3]);
    });
});
