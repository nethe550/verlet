/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A generic style generator for primitive physics objects.
 */

/**
 * @typedef {{ size: number, fill: Color, stroke: Color, thickness: number }} Style Relevant style values used for rendering primitive physics objects.
 */

import Color from '../../util/render/Color.js';

/**
 * A generic style generator for primitive physics objects.
 * @class
 */
class StyleFactory {

    /**
     * The default style.
     * @type {StyleFactory}
     */
    static get DefaultStyle() { 
        return new StyleFactory({
            size: 5,
            fill: Color.white,
            stroke: Color.black,
            thickness: 2
        });
    }

    /**
     * Creates a new style.
     * @constructor
     * @param {Style} style - The style options.
     */
    constructor(style={ size: 5, fill: Color.white, stroke: Color.black, thickness: 2 }) {
        this.size = style.size || 5;
        this.fill = style.fill || Color.white;
        this.stroke = style.stroke || Color.black;
        this.thickness = style.thickness || 2;
    }

    /**
     * Modifies the size of this style.
     * @param {number} size - The size.
     * @returns {StyleFactory} This style.
     */
    Size(size=5) {
        this.size = size;
        return this;
    }

    /**
     * Modifies the fill color of this style.
     * @param {Color} fill - The fill color.
     * @returns {StyleFactory} This style.
     */
    Fill(fill=Color.white) {
        this.fill = fill;
        return this;
    }

    /**
     * Modifies the stroke color of this style.
     * @param {Color} stroke - The stroke color.
     * @returns {StyleFactory} This style.
     */
    Stroke(stroke=Color.black) {
        this.stroke = stroke;
        return this;
    }

    /**
     * Modifies the thickness of this style.
     * @param {number} thickness - The thickness.
     * @returns {StyleFactory} This style.
     */
    Thickness(thickness=2) {
        this.thickness = thickness;
        return this;
    }

    /**
     * Creates a copy of this style.
     * @returns {StyleFactory} A copy of this style.
     */
    Copy() { 
        return new StyleFactory({
            size: this.size,
            fill: this.fill,
            stroke: this.stroke,
            thickness: this.thickness
        }); 
    }

}

export default StyleFactory;