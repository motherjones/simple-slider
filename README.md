# A Google Spreadsheet-Powered Slider

A super simple, mobile-friendly, easy-to-edit slider created from a Google spreadsheet. Slide frames by click, left and right arrow keys, or swipe. Here's what it looks like:

<p align="center">
  <img width="50%" src="https://raw.githubusercontent.com/motherjones/simple-slider/master/img/screenshot.png" alt="screenshot"/>
</p>

## Examples in the Wild

[Why Your Supermarket Sells Only 5 Kinds of Apples](http://www.motherjones.com/environment/2013/04/heritage-apples-john-bunker-maine)

[The rare earth metals we use every day](http://www.motherjones.com/environment/2012/11/rare-earth-elements-iphone-malaysia)

## How it works

*MoJo staffers:* get started by following [these instructions](https://github.com/motherjones/story-tools#starting-a-new-project).

In its most basic form, each slide consists of a `title`, `middle image`, and some caption `text`. Accordingly, you'll need to create a Google Spreadsheet with a `title`, `middle image`, `text` column, and fill the rows with your story content. We'll go over how to format the data in each column of your spreadsheet below, but here's an example row based on the screenshot above:

**title** | **middle image** | **text**
 ----------------|--------------|----------------:
 Baldwin | http://assets.motherjones.com/environment/2013/04/baldwin.jpg | One of the most popular apples in the US until freakish winter weather in 1933-34 knocked it into obscurity. <span class="credit">USDA</span>

**Get fancy:** You can play around with the slider's layout by swapping `middle image` for a `top image`, `bottom image`, or `background image` column. Or try embedding videos instead of still images by swapping `middle image` for `top video embed`, `middle video embed`, or `bottom video embed`. If you're using our base CSS, we recommend you stick with just one image or video column. But if you feel compelled to use more than one, the slider will still work.

## Set up your Google Spreadsheet

*MoJo staffers:* Make a copy of [this template]( https://docs.google.com/spreadsheet/pub?key=0AswaDV9q95oZdDZFSWpEZHlNRUlHWmVqa3JqalZsZXc&output=html) and move the copy into the relevant beat folder in the Mother Jones Google Drive. Rename the spreadsheet appropriately. Change owner to MoJo Data in ``Share > Advanced``

In your new spreadsheet, go up to `File` and click on `Publish to the web,` then click on `Start publishing`. 

A URL will appear. It will look like this: `https://docs.google.com/spreadsheet/pub?key=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc&output=html`

Copy that link. This is your spreadsheet ID or url, which you will eventually use to connect your spreadsheet to the slider.

## Modify your project files

*MoJo staffers:* By now you should have a local clone of this project repo on your machine, by following [these instructions](https://github.com/motherjones/story-tools#starting-a-new-project)

**In index.html (required):**

Paste the link you just copied into your html file, in the place of public_spreadsheet_url. The code you are looking for in the index.html file looks like this:
`$('#slideshow').slideshow('public_spreadsheet_url');`

**In style.css (optional):**

You're welcome to use our default slider style (found in demo/style.css), or style to your own taste. Again, we do think the slider looks nicest if you use only one of the image OR video columns (the demo uses only `middle image`).

## Formatting your spreadsheet data

The `title`, `text` columns should have plain text or html. You can add hyperlinks and styled text—for source credits—by wrapping them in <a href=""></a> and <span class="credit"></span>, as shown in the [How it works](https://github.com/motherjones/simple-slider/blob/master/README.md#how-it-works) section.

The `top image`, `middle image`, `bottom image`, `background image` columns should only have an image URL that ends in .jpg, .png, or .gif.

For `top video embed`, `middle video embed`, `bottom video embed`, only add the columns  in slides. Copy the video's embed code and paste that code the spreadsheet cell. The embed code looks like this:

`<iframe width="960" height="720" src="http://www.youtube.com/embed/TZzzXutPfks" frameborder="0" allowfullscreen></iframe>`

The `source` column is for *MoJo staffers* when bulletproofing our data and tracking the origin of each row's data. You're welcome to adopt this practice.

Once you've got the data formatted properly, you're almost done.

## Optional: using JSON to feed your slider

If you don't want a Google spreadsheet to power your slider, you can instead use JSON directly. Here's an example:

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
