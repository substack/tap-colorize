# tap-colorize

colorize [tap](http://testanything.org/)
in a way that preserves its machine-readability

[![testling badge](https://ci.testling.com/substack/tap-colorize.png)](https://ci.testling.com/substack/tap-colorize)

[![build status](https://secure.travis-ci.org/substack/tap-colorize.png)](http://travis-ci.org/substack/tap-colorize)

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

You can preface a color name with `'bright'`, `'dim'`. `'reverse'`, or
`'underscore'`. Use an array for a color with a string prefix if you want to
preface an rgb array color.

# attributes

## stream.mode

The ansi codes for the buffered output are placed into `stream.mode` in case you
need to print out extra data before the next line comes in. This is useful for
patching `console.log()` to show up in the ordinary terminal color and then
setting the `stream.mode` back for the next line of output.

Some terminals can do this with `'\x1b7'` to push and `'\x1b8'` to pop the
terminal context with attributes, but support for this feature is not
widespread.

If there is no active mode, `stream.mode` is `null`.

# usage

There is also a command-line program in this package.

```
usage: tap-colorize OPTIONS

  Colorize TAP from INPUT, writing colorized data to OUTPUT.

OPTIONS are:

  -i, --input    Read from INPUT. Default: stdin.
  -o, --output   Write to OUTPUT. Default: stdout.

  --info   Color of info lines.
  --pass   Color of /^ok / lines.
  --fail   Color of /^not ok/ lines.

  -h, --help     Show this help message.
  -v, --version  Print the current version of tap-parser.

```

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
