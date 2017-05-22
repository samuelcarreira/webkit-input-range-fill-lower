# webkit-input-range-fill-lower

#### webkit input range fill lower hack

Custom the input range controls like the ```::-ms-fill-lower``` property on webkit browsers (like Chrome)

![screenshot](https://github.com/samuelcarreira/webkit-input-range-fill-lower/raw/master/sample_screenshot.PNG)

I've created this "hack" because I wanted to use a range slider on my Electron App (a music player with volume control). After I tried some plugins like the [rangeslider.js](http://rangeslider.js.org/) I decided to write something more lightweight and more easy to use.
As Electron apps use Chrome (WebKit) as the render engine, I didn't add any compatibility with other browsers/fallbacks to older versions.


## Features
* Pure / vanilla JavaScript (no jQuery) 
* Customizable with CSS vars
* Works on most recent Webkit browsers (tested on Chrome and Opera)
* Multiple input ranges controls on same page
* Debug to console

## Usage
1. Download the script file
2. Include the CSS stylesheet on your page
3. Add the input range controls on your web page. **Each control needs an unique ID:**
  ``` <input type="range" min="0" max="10" value="10" id="your-custom-id"> ```
4. Customize the stylesheet vars


## History
2017-04-23 - First public version

## Credits
- Developed by: Samuel Carreira
- Inspired on this article: http://brennaobrien.com/blog/2014/05/style-input-type-range-in-every-browser.html

## License
The MIT License (MIT)
