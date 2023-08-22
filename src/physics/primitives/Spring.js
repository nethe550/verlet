/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A spring constraint.
 */

/**
 * @typedef {import('./Point.js').default} Point - A point mass.
 */

import Vector2 from '../../util/vector/Vector2.js';
import StyleFactory from '../../render/style/StyleFactory.js';

/**
 * A spring constraint.
 * @class
 */
class Spring {

    /**
     * The first connected point.
     * @type {Point}
     */
    a = null;

    /**
     * The second connected point.
     * @type {Point}
     */
    b = null;

    /**
     * The stiffness of this spring.
     * @private
     * @type {number}
     */
    _stiffness = 2;

    /**
     * The resting length of this spring.
     * @private
     * @type {number}
     */
    _restLength = -1;

    /**
     * The style of this spring.
     * @type {StyleFactory}
     */
    style = StyleFactory.DefaultStyle;

    /**
     * Creates a new spring constraint.
     * @constructor
     * @param {Point} a - The first point to connect to.
     * @param {Point} b - The second point to connect to.
     * @param {number} stiffness - The stiffness of the spring.
     * @param {number} restLength - The resting length of the spring. (-1 for automatic length)
     * @param {StyleFactory} style - The style of the spring.
     */
    constructor(a=null, b=null, stiffness=2, restLength=-1, style=StyleFactory.DefaultStyle) {
        this.a = a;
        this.b = b;
        this._stiffness = Math.max(Math.abs(stiffness), Number.EPSILON);
        this._restLength = restLength === -1 ? Vector2.Distance(this.a.position, this.b.position) : Math.max(Math.abs(restLength), Number.EPSILON);
        this.style = Object.assign({}, StyleFactory.DefaultStyle, style);
    }

    /**
     * The stiffness of this spring.
     * @type {number}
     */
    get stiffness() { return this._stiffness; }

    /**
     * The stiffness of this spring.
     * @param {number} s - The new spring stiffness.
     * @type {number}
     */
    set stiffness(s) { this._stiffness = Math.max(Math.abs(s), Number.EPSILON); }

    /**
     * The resting length of this spring.
     * @type {number}
     */
    get restLength() { return this._restLength; }

    /**
     * The resting length of this spring.
     * @param {number} rl - The new resting length of the spring.
     * @type {number}
     */
    set restLength(rl) { this._restLength = Math.max(Math.abs(rl), Number.EPSILON); }

    /**
     * Updates the spring constraint by adjusting the endpoint positions.
     * @returns {void}
     */
    update() {
        const d = this.b.position.sub(this.a.position);
        const dist = Vector2.Distance(this.a.position, this.b.position);
        const restDiff = (this._restLength - dist) / dist * this._stiffness;
        const offset = d.mul(restDiff * 0.5);

        let m1 = this.a.mass + this.b.mass; // combined
        let m2 = this.a.mass / m1; // a ratio
        m1 = this.b.mass / m1; // b ratio

        if (!this.a.fixed) this.a.position = this.a.position.sub(offset.mul(m1));
        if (!this.b.fixed) this.b.position = this.b.position.add(offset.mul(m2));
    }

    /**
     * Renders this spring to the specified rendering context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw to.
     */
    render(ctx) {
        ctx.strokeStyle = this.style.stroke.css;
        ctx.lineWidth = this.style.thickness;
        ctx.beginPath();
        ctx.moveTo(this.a.position.x, this.a.position.y);
        ctx.lineTo(this.b.position.x, this.b.position.y);
        ctx.stroke();
        ctx.closePath();
    }

}

export default Spring;