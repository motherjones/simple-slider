# A Google Spreadsheet-Powered Slider

A super simple, mobile-friendly, easy-to-edit slider created from a Google spreadsheet. Slide frames by click, left and right arrow keys, or swipe. This requires Tabletop.js, Swipe, and jQuery.

## Getting Started

### 1) Start with the barebones slider
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/motherjones/gdoc-powered-slider/master/dist/gdoc-powered-slider.min.js
[max]: https://raw.github.com/motherjones/gdoc-powered-slider/master/dist/gdoc-powered-slider.js

Copy this into your web page:

```html
<script src="jquery.js"></script>
<script src="libs/tabletop.js"></script>
<script src="libs/swipe.min.js"></script>      
<script src="dist/gdoc-powered-slider.min.js"></script>

<div id="slideshow"></div>

<script>
jQuery(function($) {
  $('#slideshow').slideshow('public_spreadsheet_url');
});
</script>
```

### 2) Add some meat to your slider using Google spreadsheet data
If don't have a data set already and are starting from scratch, great! Open up a new Google spreadsheet. For the demo, we use [this one]( https://docs.google.com/spreadsheet/pub?key=0AswaDV9q95oZdDZFSWpEZHlNRUlHWmVqa3JqalZsZXc&output=html).

In Google Docs, go up to the `File` menu and pick `Publish to the web`. Fiddle with whatever you want, then click `Start publishing`. A URL will appear, something like `https://docs.google.com/spreadsheet/pub?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc&output=html`

Copy that! In theory you're interested in the part between `key=` and `&` but you can use the whole thing if you want.

Paste that in to your call to slideshow, instead of public_spreadsheet_url, on this line:
`$('#slideshow').slideshow('public_spreadsheet_url');`

Keep in mind that in order for the slider to digest what's in the spreadsheet, you'll need to get your data into the proper format. Think of each row as one slide, and each column in that row as an element of the slide. The slider supports these columns headers: 

"text"
This column header is designated for any text that will go in the slide. You can also wrap text in this cell with anchor or span tags.

//These column headers are designated for any images that will go in the slide. They take any image URL. Make sure the link ends with .jpg, .gif, or .png.

"top image"
 
"middle image" 

"bottom image"

"background image"

If you already have a data set you want to work with, just reformat your data as necessary to make it slider-friendly, as described above. 

NOTE: If you're looking at the demo, you'll notice there's also an optional "source" column. We use this space to keep track of where we got the information feeding the "text" cells, for our internal reference. This keeps our army of fact-checkers happy.

Once you've got these headers and some data in the spreadsheet, you're basically done. Super simple, right?

### 3) Style your slider
You're welcome to use our default slider style (found in demo/style.css), or style to your own taste. We do think the slider looks nicest if you use only one of the image columns (the demo uses only "top image") but don't worry, if you insist on using more than one, the slider will still work.

## More Slider Examples
_(Coming soon)_

## License
Copyright (c) 2012 Ben Breedlove  
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)
