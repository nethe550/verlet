/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A collection of color utilities.
 */

/**
 * Clamps a number to a positive integer between 0 and 255.
 * @param {number} v - The number to clamp.
 * @returns {number} The clamped number. 
 */
const clamp = v => Math.min(Math.max(Math.floor(Math.abs(v)), 0), 255);

/**
 * A collection of color utilities.
 * @class
 */
class Color {

    /**
     * The color white.
     * @type {Color}
     */
    static white = new Color(255, 255, 255);

    /**
     * The color black.
     * @type {Color}
     */
    static black = new Color(0, 0, 0);

    /**
     * The color red.
     * @type {Color}
     */
    static red = new Color(255, 0, 0);

    /**
     * The color green.
     * @type {Color}
     */
    static green = new Color(0, 255, 0);

    /**
     * The color blue.
     * @type {Color}
     */
    static blue = new Color(0, 0, 255);

    /**
     * Creates a new color.
     * @param {number} r - The red component of the color.
     * @param {number} g - The green component of the color.
     * @param {number} b - The blue component of the color.
     * @param {number} a - The alpha (transparency) component of the color.
     */
    constructor(r, g, b, a = 255) {
        this._r = clamp(r);
        this._g = clamp(g);
        this._b = clamp(b);
        this._a = clamp(a) || 255;
    }

    /**
     * The red component of this color.
     * @returns {string}
     */
    get r() { return this._r; }
    /**
     * The green component of this color.
     * @returns {string}
     */
    get g() { return this._g; }
    /**
     * The blue component of this color.
     * @returns {string}
     */
    get b() { return this._b; }
    /**
     * The alpha (transparency) component of this color.
     * @returns {string}
     */
    get a() { return this._a; }

    /**
     * Sets the red component of this color.
     * @param {number} r - A value between 0 and 255.
     */
    set r(r) { this._r = clamp(r); }
    /**
     * Sets the red component of this color.
     * @param {number} g - A value between 0 and 255.
     */
    set g(g) { this._g = clamp(g); }
    /**
     * Sets the red component of this color.
     * @param {number} b - A value between 0 and 255.
     */
    set b(b) { this._b = clamp(b); }
    /**
     * Sets the red component of this color.
     * 
     * Any values less than 1 will be considered the CSS string representation of alpha values (i.e. percentage),
     * and will be scaled accordingly to the 0-255 range.
     * @param {number} a - A value between 0 and 255.
     */
    set a(a) { this._a = a < 1 ? clamp(a * 255) : clamp(a); }

    /**
     * The CSS string representation of this color.
     * @returns {string}
     */
    get css() {
        return `rgba(${this._r},${this._g},${this._b},${this._a / 255})`;
    }

    /**
     * The hexadecimal string representation of this color.
     * @returns {string}
     */
    get hex() {
        return `#${this._r.toString(16).padStart(2, '0')}${this._g.toString(16).padStart(2, '0')}${this._b.toString(16).padStart(2, '0')}`;
    }

    /**
     * A random color.
     * @returns {Color}
     */
    static get random() {
        const random = () => Math.floor(Math.random() * 255);
        return new Color(random(), random(), random(), 255);
    }

    /**
     * Checks whether an object is a valid color.
     * @param {Object} color - The object to check.
     * @returns {boolean} Whether the provided object is a valid color.
     */
    static IsColor(color) {
        return (color instanceof Color || typeof color === 'object') && 
               (color.r !== null && typeof color.r === 'number') &&
               (color.g !== null && typeof color.g === 'number') &&
               (color.b !== null && typeof color.b === 'number') &&
               (color.a !== null && typeof color.a === 'number');
    }

}

export default Color;