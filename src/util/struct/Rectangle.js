/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A structure defining an axis-aligned rectangular region.
 */

import Vector2 from '../vector/Vector2.js';

/**
 * A structure defining an axis-aligned rectangular region.
 * @class
 */
class Rectangle {

    /**
     * A rectangle positioned at (0, 0) with dimensions (1, 1)
     * @type {Rectangle}
     */
    static get one() { return new Rectangle(0, 0, 1, 1); }

    /**
     * Creates a new rectangle.
     * @constructor
     * @param {number} x - The x position of the rectangle.
     * @param {number} y - The y position of the rectangle.
     * @param {number} w - The width of the rectangle.
     * @param {number} h - The height of the rectangle.
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * The position of the rectangle.
     * @type {Vector2}
     */
    get position() { return new Vector2(this.x, this.y); }

    /**
     * The position of the rectangle.
     * @param {Vector2} p - The new position.
     * @type {Vector2}
     */
    set position(p) { this.x = p.x; this.y = p.y; }

    /**
     * The size of the rectangle.
     * @type {Vector2}
     */
    get size() { return new Vector2(this.w, this.h); }

    /**
     * The size of the rectangle.
     * @param {Vector2} s - The new size.
     * @type {Vector2} 
     */
    set size(s) { this.w = s.x; this.h = s.y; }

    /**
     * Checks whether a point is within the horizontal bounds of this rectangle.
     * @param {Vector2} p - The point to check.
     * @returns {boolean} Whether the point is within the horizontal bounds of this rectangle.
     */
    insideColumn(p=Vector2.zero) {
        return p.x >= this.x && p.x <= this.x + this.w;
    }

    /**
     * Checks whether a point is within the vertical bounds of this rectangle.
     * @param {Vector2} p - The point to check.
     * @returns {boolean} Whether the point is within the vertical bounds of this rectangle.
     */
    insideRow(p=Vector2.zero) {
        return p.y >= this.y && p.y <= this.y + this.h
    }

    /**
     * Checks whether a point is within the bounds of this rectangle.
     * @param {Vector2} p - The point to check.
     * @returns {boolean} Whether the point is within the bounds of this rectangle.
     */
    inside(p=Vector2.zero) {
        return this.insideColumn(p) && this.insideRow(p);
    }

    /**
     * Generates a position from a vector relative to the bounds of this rectangle.
     * @param {Vector2} p - The relative point.
     * @returns {Vector2} The absolute point relative to the bounds of this rectangle.
     */
    relative(p=Vector2.zero) {
        return p.mul(this.size).add(this.position);
    }

    /**
     * Constrains a position to the bounds of this rectangle.
     * @param {Vector2} p - The position to constrain.
     * @param {number} offset - The inner offset from the edges of the bounds of this rectangle.
     * @returns {Vector2} The constrained point.
     */
    constrain(p=Vector2.zero, offset=0) {
        return Rectangle.Constrain(p, this, offset);
    }

    /**
     * Constrains a position to the bounds of a rectangle.
     * @param {Vector2} p - The position to constrain.
     * @param {Rectangle} rect - The bounds to constrain the position to.
     * @param {number} offset - The inner offset from the edges of the bounds of the provided rectangle.
     * @returns {Vector2} The constrained point.
     */
    static Constrain(p=Vector2.zero, rect=Rectangle.one, offset=0) {
        const w = rect.x + rect.w;
        const h = rect.y + rect.h;
        const n = p.copy();
        if (p.x > w - offset) n.x = w - offset; // right
        if (p.x < rect.x + offset) n.x = rect.x + offset; // left
        if (p.y > h - offset) n.y = h - offset; // down
        if (p.y < rect.y + offset) n.y = rect.y + offset; // up
        return n;
    }

}

export default Rectangle;