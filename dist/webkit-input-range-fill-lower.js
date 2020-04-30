/*!
 * Webkit-input-range-fill-lower
 *
 * Licensed under MIT
 * Copyright (c) 2020 [Samuel Carreira]
 */
class WebkitInputRangeFillLower {
    /**
     * Webkit input range fill lower hack
     *
     * @param options the range selector ID or an array with multiple IDs
     *                and the range elements custom style (background color)
     *
     * @example
     * document.addEventListener('DOMContentLoaded', () => {
     *    const _test = new WebkitInputRangeFillLower({selectors: ['range1', 'range2'], color: '#ff00ff'});
     *    console.log(_test.getElementsList);
     * });
     *
     * new WebkitInputRangeFillLower({selectors: ['range1', 'range2']}); // with default styles
     * new WebkitInputRangeFillLower({selectors: 'range1', angle: 90, gradient: 'rgba(238,174,202,1) 0%, rgba(198,180,216,1) 74%, rgba(148,187,233,1) 100%'}); // only one element with complex gradient
     */
    constructor(options) {
        this.options = options;
        this._updatedInlineStyle = document.createElement('style');
        document.body.append(this._updatedInlineStyle);
        this._cachedValues = [];
        this._validateOptions(options);
        this._removeDuplicates();
        this._removeUnknownElements();
        this._removeInvalidElements();
        this._setSelectorsCombined();
        this._addDefaultStyles();
        this._addEventListeners();
    }
    /**
     * List of ID selectors
     */
    get getElementsList() {
        return this._options.selectors.map(value => `#${value}`);
    }
    /**
     * Apply default values to invalid settings
     */
    _validateOptions(options) {
        const defaultOptions = {
            selectors: null,
            angle: 90,
            color: null,
            gradient: null
        };
        this._options = Object.assign(Object.assign({}, defaultOptions), options);
        if (!Array.isArray(options.selectors)) {
            this._options.selectors = [options.selectors];
        }
        if (this._options.angle < 0 || this._options.angle > 360) {
            this._options.angle = 90;
        }
        if (this._options.color === null && this._options.gradient === null) {
            // If none color provided, the default is a gradient
            this._options.gradient = '#0ABFBC, #FC354C';
        }
        if (this._options.color !== null && !this._validateColor(this._options.color)) {
            throw new TypeError('Please enter a valid CSS color');
        }
    }
    /**
     * Add event listeners (input event) to the input range type elements
     */
    _addEventListeners() {
        const eventName = new Event('input');
        for (const id of this._options.selectors) {
            const selector = document.getElementById(id);
            selector.addEventListener('input', () => {
                const rangeInterval = Number(selector.getAttribute('max')) - Number(selector.getAttribute('min'));
                // @ts-ignore because value
                const rangePercent = (Number(selector.value) + Math.abs(Number(selector.getAttribute('min')))) / rangeInterval * 100;
                // Console.log('#' + id + ': ' + rangePercent + '%');
                this._writeStyle(id, rangePercent);
            }, false);
            selector.dispatchEvent(eventName); // Update the values now
        }
    }
    /**
     * Manage the Cached Data
     * @param id element id
     * @param percent percent value
     */
    _checkCachedData(id, percent) {
        const findResult = this._cachedValues.map(x => x.id).indexOf(id);
        if (findResult === -1) {
            this._cachedValues.push({ id, percent });
        }
        else {
            this._cachedValues[findResult] = { id, percent };
        }
    }
    /**
     * Write the dynamic inline stylesheet with the
     * -webkit-slider-runnable-track CSS pseudo-element
     * Checks for cached values (before writing)
     *
     * @param id element id
     * @param percent percent value
     */
    _writeStyle(id, percent) {
        this._checkCachedData(id, percent);
        let textToWrite = '';
        for (const item of this._cachedValues) {
            textToWrite += `#${item.id}::-webkit-slider-runnable-track{background-size: ${item.percent}% 100% !important }`;
        }
        this._updatedInlineStyle.textContent = textToWrite;
    }
    /**
     * Remove duplicate selectors
     */
    _removeDuplicates() {
        this._options.selectors = this._options.selectors.filter((item, index) => this._options.selectors.indexOf(item) === index);
    }
    /**
     * Remove unknown selectors (invalid IDs)
     */
    _removeUnknownElements() {
        this._options.selectors = this._options.selectors.filter((id) => document.getElementById(id) !== null);
    }
    /**
     * Remove elements which aren't an input range type elements
     */
    _removeInvalidElements() {
        // @ts-ignore
        this._options.selectors = this._options.selectors.filter((id) => document.getElementById(id).type === 'range');
    }
    /**
     * Stores a list of all IDs combined to use on the dynamic CSS
     */
    _setSelectorsCombined() {
        let selectorText = '';
        this._options.selectors.forEach((element, index) => {
            selectorText += `#${element}`;
            if (index < (this._options.selectors.length - 1)) {
                selectorText += ', ';
            }
        });
        this._selectors_combined = selectorText;
    }
    /**
     * Manage CSS gradients, if only one color is supplied
     * generates a 'solid color' with the same color gradient
     */
    _generateGradientCSS() {
        // Const colors = this._options.color.split(', ');
        let cssColors = '';
        // If (colors.length < 2) {
        //   cssColors = `${this._options.color}, ${this._options.color}`;
        // } else {
        //   cssColors = this._options.color;
        // }
        if (this._options.color === null) {
            cssColors = this._options.gradient; // Use gradient
        }
        else {
            cssColors = `${this._options.color}, ${this._options.color}`;
        }
        return `${this._options.angle}deg, ${cssColors}`;
    }
    /**
     * Add the default styles to document:
     *  removes default appearence
     *  removes outline
     *  styles the background (webkit-slider-runnable-track) with the custom colors
     *  adds quick fallbacks for Mozilla Firefox and IE
     */
    _addDefaultStyles() {
        let runnableTrackPortion = '';
        this._options.selectors.forEach(id => {
            const backgroundStyle = `background: linear-gradient(${this._generateGradientCSS()}) 0 100% no-repeat content-box !important;`;
            runnableTrackPortion += `#${id}::-webkit-slider-runnable-track {${backgroundStyle}} `;
            runnableTrackPortion += `#${id}::-moz-range-progress {${backgroundStyle}} `;
            runnableTrackPortion += `#${id}::-ms-fill-lower {${backgroundStyle}} `;
        });
        // ${this._selectors_combined} {-webkit-appearance: none !important;}
        const defaultCSS = `<style>
      ${runnableTrackPortion}
      ${this._selectors_combined}:focus {outline: none !important;}
    </style>`;
        document.head.insertAdjacentHTML('beforeend', defaultCSS);
    }
    /**
     * Validate CSS color
     * https://stackoverflow.com/a/48485007/4521967
     * @param strColor color #fff, rgba(255,255,255,1), rgb(255,0,255), etc.
     */
    _validateColor(stringColor) {
        const s = new Option().style;
        s.color = stringColor;
        return s.color !== '';
    }
}
//# sourceMappingURL=webkit-input-range-fill-lower.js.map