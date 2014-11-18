# A Google Spreadsheet-Powered Slider

A super simple, mobile-friendly, easy-to-edit slider created from a Google spreadsheet. Slide frames by click, left and right arrow keys, or swipe. Here's what it looks like:

<p align="center">
  <img width="50%" src="https://raw.githubusercontent.com/motherjones/simple-slider/master/img/screenshot.png" alt="screenshot"/>
</p>

## Examples in the Wild

[Why Your Supermarket Sells Only 5 Kinds of Apples](http://www.motherjones.com/environment/2013/04/heritage-apples-john-bunker-maine)

[The rare earth metals we use every day](http://www.motherjones.com/environment/2012/11/rare-earth-elements-iphone-malaysia)

## How it works

Each slide consists of a `title`, `middle image`, and some caption `text`. You'll need to populate a Google Spreadsheet with the content you want in each slide. (Note that video embeds are not fully supported at this stage.) Here's an example based on the screenshot above:

`title`: Baldwin

`middle image`: http://assets.motherjones.com/environment/2013/04/baldwin.jpg

`text`: `One of the most popular apples in the US until freakish winter weather in 1933-34 knocked it into obscurity. <span class="credit">USDA</span>`

We'll go over how to format the data in each column of your spreadsheet below.

*MoJo staffers:* get started by following [these instructions](https://github.com/motherjones/story-tools#starting-a-new-project). When you're done, upload to s3 and embed in the shell [(how to)](https://github.com/motherjones/story-tools#starting-a-new-project).

## Set up your Google Spreadsheet

*MoJo staffers:* Make a copy of [this template]( https://docs.google.com/spreadsheet/pub?key=0AswaDV9q95oZdDZFSWpEZHlNRUlHWmVqa3JqalZsZXc&output=html) and move the copy into the relevant beat folder in the Mother Jones Google Drive. Rename the spreadsheet appropriately. Change owner to MoJo Data in ``Share > Advanced``

In your new spreadsheet, go up to the `File` menu and pick `Publish to the web,` then click `Start publishing`. 

A URL will appear. It will look like this: `https://docs.google.com/spreadsheet/pub?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc&output=html`

Copy that link. This is your spreadsheet ID or url, which you will eventually use to connect your spreadsheet to the slider.

## Modify your project files

*MoJo staffers:* By now you should have a local clone of this project repo on your machine, by following [these instructions](https://github.com/motherjones/story-tools#starting-a-new-project)

**In index.html:**

Paste the link you just copied into your html file, in the place of public_spreadsheet_url. The code you are looking for in the index.html file looks like this:
`$('#slideshow').slideshow('public_spreadsheet_url');`

## Format your spreadsheet data

Think of each row of your spreadsheet as one slide, and each column in that row as an element of the slide. The slider supports the following columns headers: 

`title`	`text` 		`top image` `middle image`	`bottom image` `background image` 		`top video embed` 	`middle video embed`	`bottom video embed`

The `title` and `text` columns are designated for any text that will go in the slide. Only include the columns you want; they're all optional. You can add hyperlinks and styled text—for source credits—by wrapping them in <a href=""></a> and <span class="credit"></span>.

The `top image` `middle image`	`bottom image` `background image` columns are designated for any images that will go in the slide. They take any image URL. Make sure the link ends with .jpg, .gif, or .png.

The `top video embed` `middle video embed`	`bottom video embed` columns are designated for embedding videos in slides. Copy the video's embed code and paste that code the spreadsheet cell. The embed code will look something like this:

`<iframe width="960" height="720" src="http://www.youtube.com/embed/TZzzXutPfks" frameborder="0" allowfullscreen></iframe>`

*Note:* The `source` column is for *MoJo staffers*—it keeps our army of fact-checkers happy.

Once you've got the data formatted properly, you're almost done.

**In style.css**

You're welcome to use our default slider style (found in demo/style.css), or style to your own taste. We do think the slider looks nicest if you use only one of the image OR video columns (the demo uses only "top image"). If you insist on using more than one, however, the slider will still work.

*MoJo staffers:*

## Optional: using JSON to feed your slider

If you don't want a Google spreadsheet to power your slider, you can instead use JSON directly, which will look like this:

```

var slideshow = jQuery.slideshow([
	{
		backgroundimage: 'http://i.imgur.com/QYMjo.jpg',
		topimage: 'http://i.imgur.com/QYMjo.jpg',
		topvideoembed: '<iframe width="960" height="720" src="http://www.youtube.com/embed/TZzzXutPfks" frameborder="0" allowfullscreen></iframe>',
		title: 'Goats and Kittens That Faint',
		middleimage: 'http://i.imgur.com/QYMjo.jpg',
		middlevideooembed: '<iframe width="960" height="720" src="http://www.youtube.com/embed/TZzzXutPfks" frameborder="0" allowfullscreen></iframe>',
		text: 'Awwww-inspiring animals',
		bottomimage: 'http://i.imgur.com/QYMjo.jpg',
		bottomvideoembed: '<iframe width="960" height="720" src="http://www.youtube.com/embed/TZzzXutPfks" frameborder="0" allowfullscreen></iframe>'
	}	
]);

```

## License
Copyright (c) 2012 Mother Jones
