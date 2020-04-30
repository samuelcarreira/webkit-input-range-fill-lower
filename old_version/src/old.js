/*!
 * Webkit-input-range-fill-lower
 * Version 1.0 (old version)
 *
 * Licensed under MIT
 * Copyright (c) 2020 [Samuel Carreira]
 */

"use strict";

const DEBUG = true;

var inlineStyle = document.createElement('style');
var rangeSelector = document.querySelectorAll('[type=range]');
var inlineStyleContent = new Array;

document.body.appendChild(inlineStyle);

var eventname = new Event('input');

for (let item of rangeSelector) {
    item.addEventListener('input', function () {
        let rangeInterval = Number(this.getAttribute('max') - this.getAttribute('min'));
        let rangePercent = (Number(this.value) + Math.abs(this.getAttribute('min'))) / rangeInterval * 100;

        DEBUG ? console.log("#" + this.id + ": " + rangePercent + "%") : ''; // for debug

        writeStyle({
            id: this.id,
            percent: rangePercent
        });
    }, false);

    item.dispatchEvent(eventname); // update bars at startup
}

/**
 * Write Style element
 * 
 * @param {object} obj id: HTML id, percent: value
 */
function writeStyle(obj) {
    var find = inlineStyleContent.map(x => x.id).indexOf(obj.id);
    var styleText = "";

    if (find === -1) {
        inlineStyleContent.push(obj)
    } else {
        inlineStyleContent[find] = obj;
    }

    for (let item of inlineStyleContent) {
        styleText += '#' + item.id + '::-webkit-slider-runnable-track{background-size:' + item.percent + '% 100%} ';
    }

    inlineStyle.textContent = styleText;
}