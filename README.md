# webkit-input-range-fill-lower

#### webkit input range fill lower hack

Fill the input range like the ::-ms-fill-lower property for webkit (Chrome) - Pure JS/CSS

![screenshot](https://github.com/samuelcarreira/webkit-input-range-fill-lower/raw/master/sample_screenshot.PNG)

I've created this "hack" because I wanted to use a range slider on my Electron App (a music player with volume control). After I tried some plugins like the [rangeslider.js](http://rangeslider.js.org/) I decided to write something more lightweight and more easy to use.
As Electron apps use Chrome (WebKit) as the render engine, I didn't add any compatibility with other browsers/fallbacks to older versions.


## Featuresdd
* Pure / vanilla JavaScript (no jQuery) 
* Customizable with CSS vars
* Works on most recent Webkit browsers (tested on Chrome and Opera)
* Multiple input ranges controls on same page
* Debug to console

## Usage
1. Download the script file
2. Include the CSS stylesheet on your page
3. Add the input range controls on your web page. **Each control need an unique ID**
  ``` <input type="range" min="0" max="10" value="10" id="range1"> ```
4. Custom the stylesheet vars


## History
2017-04-23 - First public version

## Credits
- Developed by: Samuel Carreira

## License
The MIT License (MIT)
