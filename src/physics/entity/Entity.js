/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A generic entity consisting of point-masses and springs.
 */

/**
 * @typedef {import('../primitives/Point.js').default} Point A point mass.
 * @typedef {import('../primitives/Spring.js').default} Spring A spring constraint.
 * @typedef {import('../../util/struct/Rectangle.js').default} Rectangle A structure defining an axis-aligned rectangular region.
 * @typedef {import('../../render/style/StyleFactory.js').default} StyleFactory 
 */

/**
 * A generic entity consisting of point-masses and springs.
 * @class
 */
class Entity {

    /**
     * The number of physics iterations performed per update.
     * @private
     * @type {number}
     */
    _iterations = 32;

    /**
     * The points in this entity.
     * @type {Set}
     */
    points = null;

    /**
     * The springs in this entity.
     * @type {Set}
     */
    springs = null;

    /**
     * Creates a new entity.
     * @constructor
     * @param {number} iterations - The number of physics iterations to perform per update. 
     * @param {Set} points - (Optional) The points in the new entity.
     * @param {Set} springs - (Optional) The springs in the new entity.
     */
    constructor(iterations=32, points=new Set(), springs=new Set()) {
        this._iterations = Math.max(Math.floor(Math.abs(iterations)), 1);
        this.points = points instanceof Set ? points : Array.isArray(points) ? new Set(points) : new Set();
        this.springs = springs instanceof Set ? springs : Array.isArray(springs) ? new Set(springs) : new Set();
    }

    /**
     * The number of physics iterations performed per update.
     * @type {number}
     */
    get iterations() { return this._iterations; }

    /**
     * The number of physics iterations performed per update.
     * @param {number} i - The new iterations value.
     * @type {number}
     */
    set iterations(i) { this._iterations = Math.max(Math.floor(Math.abs(i)), 1); }

    /**
     * Adds a point to this entity.
     * @param {Point} p - The point to add. 
     * @returns {boolean} Whether the point was successfully added. 
     */
    addPoint(p=null) {
        if (p && !this.points.has(p)) return Boolean(this.points.add(p));
        else return false;
    }

    /**
     * Adds points to this entity.
     * @param  {...Point} p - The points to add.
     * @returns {Array<boolean>} The success states of the added points.
     */
    addPoints(...p) {
        if (p && p.length > 0) {
            const r = [];
            for (let _p of p) {
                r.push(this.addPoint(_p));
            }
            return r;
        }
        return [];
    }

    /**
     * Removes a point from this entity.
     * @param {Point} p - The point to remove.
     * @returns {boolean} Whether the point exists and was removed (true), or was ignored (false).
     */
    removePoint(p=null) {
        return this.points.delete(p);
    }

    /**
     * Removes points from this entity.
     * @param  {...Point} p - The points to remove.
     * @returns {Array<boolean>} The success states of the removed points.
     */
    removePoints(...p) {
        if (p && p.length > 0) {
            const r = [];
            for (let _p of p) {
                r.push(this.removePoint(_p));
            }
            return r;
        }
        return [];
    }

    /**
     * Adds a spring to this entity.
     * @param {Spring} s - The spring to add.
     * @returns {boolean} Whether the spring was added successfully.
     */
    addSpring(s=null) {
        if (s && !this.springs.has(s)) return Boolean(this.springs.add(s));
        else return false;
    }

    /**
     * Adds springs to this entity.
     * @param  {...Spring} s - The springs to add.
     * @returns {Array<boolean>} The success states of the added springs.
     */
    addSprings(...s) {
        if (s && s.length > 0) {
            const r = [];
            for (let _s of s) {
                r.push(this.addSpring(_s));
            }
            return r;
        }
        return [];
    }

    /**
     * Removes a spring from this entity.
     * @param {Spring} s - The spring to remove.
     * @returns {boolean} Whether the spring exists and was removed (true), or was ignored (false).
     */
    removeSpring(s=null) {
        return this.springs.delete(s);
    }

    /**
     * Removes springs from this entity.
     * @param  {...Spring} s - The springs to remove.
     * @returns {Array<boolean>} The success states of the removed springs.
     */
    removeSprings(...s) {
        if (s && s.length > 0) {
            const r = [];
            for (let _s of s) {
                r.push(this.removeSpring(_s));
            }
            return r;
        }
        return [];
    }

    /**
     * Updates the points and springs in this entity.
     * @param {Rectangle} bounds - The bounds of the simulation.
     * @returns {void}
     */
    update(bounds) {
        if (this.points.length === 0) return;

        for (let p of this.points) {
            p.update();
            p.position = bounds.constrain(p.position, p.style.size);
        }

        if (this.springs.length === 0) return;
        for (let i = 0; i < this._iterations; i++) {

            // constrain points as springs adjust
            for (let p of this.points) {
                p.position = bounds.constrain(p.position, p.style.size);
            }

            for (let s of this.springs) {
                s.update();
            }
        }
    }

    /**
     * Renders this entity to a specified rendering context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw to.
     * @returns {void}
     */
    render(ctx) {
        if (this.points.length === 0) return;

        if (this.springs.length !== 0) {
            for (let s of this.springs) { s.render(ctx); }
        }
        
        for (let p of this.points) { p.render(ctx); }
    }

}

export default Entity;