/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A point mass.
 */

import Vector2 from '../../util/vector/Vector2.js';
import StyleFactory from '../../render/style/StyleFactory.js';

/**
 * A point mass.
 * @class
 */
class Point {

    /**
     * Whether this point's position can be modified by constraints and external forces.
     * @type {boolean}
     */
    fixed = false;

    /**
     * The position of this point.
     * @type {Vector2}
     */
    position = Vector2.zero;

    /**
     * The position delta of this point.
     * @private
     * @type {Vector2}
     */
    _dpos = null;

    /**
     * The mass of this point.
     * @private
     * @type {number}
     */
    _mass = 1;

    /**
     * The global friction of this point.
     * @private
     * @type {number}
     */
    _friction = 0.03;

    /**
     * The constant force affecting this point.
     * @type {Vector2}
     */
    gravity = Vector2.down;

    /**
     * The style of this point.
     * @type {StyleFactory}
     */
    style = StyleFactory.DefaultStyle;

    /**
     * Creates a new point mass.
     * @constructor
     * @param {boolean} fixed - Whether the point's position can be modified by constraints and external forces.
     * @param {Vector2} position - The position of the point.
     * @param {Vector2} velocity - The velocity of the point.
     * @param {number} mass - The mass of the point.
     * @param {number} friction - The global friction of the point.
     * @param {Vector2} gravity - A constant force affecting the point.
     * @param {StyleFactory} style - The style of the point.
     */
    constructor(fixed=false, position=Vector2.zero, velocity=Vector2.zero, mass=1, friction=0.03, gravity=Vector2.down, style=StyleFactory.DefaultStyle) {
        this.fixed = fixed;
        this.position = position;
        this._dpos = velocity && !Vector2.IsZero(velocity) ? this.position.add(velocity) : this.position.copy();
        this._mass = Math.min(Math.max(Number.EPSILON, Math.abs(mass)), Number.MAX_VALUE);
        this._friction = Math.min(Math.max(friction, 0), 1);
        this.gravity = gravity;
        this.style = Object.assign({}, StyleFactory.DefaultStyle, style);
    }

    /**
     * The global friction of this point.
     * @type {number}
     */
    get friction() { return this._friction; }

    /**
     * The global friction of this point.
     * @param {number} f - The new friction value.
     * @type {number}
     */
    set friction(f) { this._friction = Math.min(Math.max(f, 0), 1); }

    /**
     * The mass of this point.
     * @type {number}
     */
    get mass() { return this._mass; }

    /**
     * The mass of this point.
     * @param {number} m - The new mass value.
     * @type {number}
     */
    set mass(m) { this._mass = Math.min(Math.max(Number.EPSILON, Math.abs(m)), Number.MAX_VALUE); }

    /**
     * Resets the velocity of this point.
     * @returns {void}
     */
    clearVelocity() {
        this._dpos.set(this.position.x, this.position.y);
    }

    /**
     * Updates this point's position according to its velocity.
     * @returns {void}
     */
    update() {
        if (this.fixed) return;
        let velocity = this.position.sub(this._dpos).mul(1 - this._friction);
        this._dpos.set(this.position.x, this.position.y);
        this.position = this.position.add(velocity).add(this.gravity);
    }

    /**
     * Renders this point to a specified rendering context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw to.
     * @returns {void}
     */
    render(ctx) {
        ctx.fillStyle = this.style.fill.css;
        ctx.strokeStyle = this.style.stroke.css;
        
        ctx.lineWidth = this.style.thickness;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.style.size, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

export default Point;