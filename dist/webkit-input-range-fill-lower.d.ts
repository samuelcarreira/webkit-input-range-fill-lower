/*!
 * Webkit-input-range-fill-lower
 *
 * Licensed under MIT
 * Copyright (c) 2020 [Samuel Carreira]
 */
interface WebkitInputRangeFillLowerCachedValues {
    /**
     * HTML ID attribute
     */
    id: string;
    /**
     * Range value (0-100%)
     */
    percent: number;
}
interface WebkitInputRangeFillLowerOptions {
    /**
     * List of HTML ID attributes to work with
     */
    selectors: string[];
    /**
     * Gradient angle (0-360 degrees)
     */
    angle?: number;
    /**
     * CSS color
     * @example
     * '#fff'
     * 'rgb(255, 255, 2, 0.5)'
     * 'rgb(128, 125, 23)'
     * 'red'
     */
    color?: string;
    /**
     * Gradient CSS color
     * @example
     * 'rgba(238,174,202,1) 0%, rgba(198,180,216,1) 74%, rgba(148,187,233,1) 100%'
     * 'red, blue'
     * 'rgb(128, 125, 23), rgb(0, 125, 123)'
     */
    gradient?: string;
}
declare class WebkitInputRangeFillLower {
    options: WebkitInputRangeFillLowerOptions;
    /**
     * Formated selectors to use in CSS styles
     * @example
     * #range1, #myrange2
     */
    private _selectors_combined;
    /**
     * The dynamic inline style
     * used to store the background values (update progress value)
     */
    private readonly _updatedInlineStyle;
    /**
     * Class options with List of HTML ID attribute to work with and
     * range elements custom style (background color)
     */
    private _options;
    /**
     * Elements cached values to speed up the Inline Style fill up
     * The system stores in memory the other values, so there is no need
     * to read each value again and perform the calculations
     */
    private _cachedValues;
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
    constructor(options: WebkitInputRangeFillLowerOptions);
    /**
     * List of ID selectors
     */
    get getElementsList(): string[];
    /**
     * Apply default values to invalid settings
     */
    private _validateOptions;
    /**
     * Add event listeners (input event) to the input range type elements
     */
    private _addEventListeners;
    /**
     * Manage the Cached Data
     * @param id element id
     * @param percent percent value
     */
    private _checkCachedData;
    /**
     * Write the dynamic inline stylesheet with the
     * -webkit-slider-runnable-track CSS pseudo-element
     * Checks for cached values (before writing)
     *
     * @param id element id
     * @param percent percent value
     */
    private _writeStyle;
    /**
     * Remove duplicate selectors
     */
    private _removeDuplicates;
    /**
     * Remove unknown selectors (invalid IDs)
     */
    private _removeUnknownElements;
    /**
     * Remove elements which aren't an input range type elements
     */
    private _removeInvalidElements;
    /**
     * Stores a list of all IDs combined to use on the dynamic CSS
     */
    private _setSelectorsCombined;
    /**
     * Manage CSS gradients, if only one color is supplied
     * generates a 'solid color' with the same color gradient
     */
    private _generateGradientCSS;
    /**
     * Add the default styles to document:
     *  removes default appearence
     *  removes outline
     *  styles the background (webkit-slider-runnable-track) with the custom colors
     *  adds quick fallbacks for Mozilla Firefox and IE
     */
    private _addDefaultStyles;
    /**
     * Validate CSS color
     * https://stackoverflow.com/a/48485007/4521967
     * @param strColor color #fff, rgba(255,255,255,1), rgb(255,0,255), etc.
     */
    private _validateColor;
}
