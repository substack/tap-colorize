var test = require('tape');
var colorize = require('../');

test.createStream().pipe(colorize()).pipe(process.stdout);

test(function (t) {
    t.plan(2);
    t.equal(1+1, 2);
    t.deepEqual([ 1, 2, 3 ], [ 1, 4, 3 ]);
});
