# tap-colorize

colorize [tap](http://testanything.org/)
in a way that preserves its machine-readability

# example

``` js
var test = require('tape');
var colorize = require('tap-colorize');

test.createStream().pipe(colorize()).pipe(process.stdout);

test(function (t) {
    t.plan(2);
    t.equal(1+1, 2);
    t.deepEqual([ 1, 2, 3 ], [ 1, 4, 3 ]);
});
```

or use the command-line client:

```
$ node test/beep.js | tap-colorize
```

# methods

``` js
var colorize = require('tap-colorize')
```

## var stream = colorize(opts)

Return a transform stream that adds colors to tap-specific lines. The colors are
added at the end of the previous line so that the output is still
machine-readable by a tap parser.

Options are:

`opts.pass` - the color to use for `/^ok /` lines
`opts.fail` - the color to use for `/^not ok /` lines
`opts.info` - the color to use for comments and version lines

Colors can be a hex code starting with a `#`, an array of rgb `0-255` integers,
or a [color name](https://www.npmjs.org/package/colornames).

# install

With [npm](https://npmjs.org), to get the module do:

```
npm install tap-colorize
```

or to get the command-line program, do:

```
npm install -g tap-colorize
```

# license

MIT
