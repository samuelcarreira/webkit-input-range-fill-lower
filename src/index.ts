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

class WebkitInputRangeFillLower {
  /**
   * Formated selectors to use in CSS styles
   * @example
   * #range1, #myrange2
   */
  private _selectors_combined: string;
  /**
   * The dynamic inline style
   * used to store the background values (update progress value)
   */
  private readonly _updatedInlineStyle: HTMLElement;
  /**
   * Class options with List of HTML ID attribute to work with and
   * range elements custom style (background color)
   */
  private _options: WebkitInputRangeFillLowerOptions;
  /**
   * Elements cached values to speed up the Inline Style fill up
   * The system stores in memory the other values, so there is no need
   * to read each value again and perform the calculations
   */
  private _cachedValues: WebkitInputRangeFillLowerCachedValues[];

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
  constructor(public options: WebkitInputRangeFillLowerOptions) {
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
  get getElementsList(): string[] {
    return this._options.selectors.map(value => `#${value}`);
  }

  /**
   * Apply default values to invalid settings
   */
  private _validateOptions(options: WebkitInputRangeFillLowerOptions): void {
    const defaultOptions: WebkitInputRangeFillLowerOptions = {
      selectors: null,
      angle: 90,
      color: null,
      gradient: null
    };
    this._options = {...defaultOptions, ...options};

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
  private _addEventListeners(): void {
    const eventName = new Event('input');

    for (const id of this._options.selectors) {
      const selector: HTMLElement = document.getElementById(id);

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
  private _checkCachedData(id: string, percent: number): void {
    const findResult = this._cachedValues.map(x => x.id).indexOf(id);

    if (findResult === -1) {
      this._cachedValues.push({id, percent});
    } else {
      this._cachedValues[findResult] = {id, percent};
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
  private _writeStyle(id: string, percent: number): void {
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
  private _removeDuplicates(): void {
    this._options.selectors = this._options.selectors.filter((item, index) => this._options.selectors.indexOf(item) === index);
  }

  /**
   * Remove unknown selectors (invalid IDs)
   */
  private _removeUnknownElements(): void {
    this._options.selectors = this._options.selectors.filter((id: string) => document.getElementById(id) !== null);
  }

  /**
   * Remove elements which aren't an input range type elements
   */
  private _removeInvalidElements(): void {
    // @ts-ignore
    this._options.selectors = this._options.selectors.filter((id: string) => document.getElementById(id).type === 'range');
  }

  /**
   * Stores a list of all IDs combined to use on the dynamic CSS
   */
  private _setSelectorsCombined(): void {
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
  private _generateGradientCSS(): string {
    // Const colors = this._options.color.split(', ');

    let cssColors = '';

    // If (colors.length < 2) {
    //   cssColors = `${this._options.color}, ${this._options.color}`;
    // } else {
    //   cssColors = this._options.color;
    // }

    if (this._options.color === null) {
      cssColors = this._options.gradient; // Use gradient
    } else {
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
  private _addDefaultStyles(): void {
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
  private _validateColor(stringColor: string): boolean {
    const s = new Option().style;
    s.color = stringColor;
    return s.color !== '';
  }
}
