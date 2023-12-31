/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A cloth entity generator.
 */

/**
 * @callback FixedPointGenerator
 * @param {number} x - The x coordinate of the point.
 * @param {number} y - The y coordinate of the point.
 * @returns {boolean} Whether the point should be fixed.
 * 
 * @callback MassGenerator
 * @param {number} x - The x coordinate of the point.
 * @param {number} y - The y coordinate of the point.
 * @returns {number} The mass of the point.
 * 
 * @callback FrictionGenerator
 * @param {number} x - The x coordinate of the point.
 * @param {number} y - The y coordinate of the point.
 * @returns {number} The global friction of the point.
 * 
 * @callback StiffnessGenerator
 * @param {number} x - The x index of the spring.
 * @param {number} y - The y index of the spring.
 * @returns {number} The stiffness of the spring.
 * 
 * @callback PointStyleGenerator
 * @param {number} x - The x coordinate of the point.
 * @param {number} y - The y coordinate of the point.
 * @returns {StyleFactory} The point style.
 * 
 * @callback SpringStyleGenerator
 * @param {number} x - The x index of the spring.
 * @param {number} y - The y index of the spring.
 * @returns {StyleFactory} The spring style.
 */

import Vector2 from '../../../util/vector/Vector2.js';
import Point from '../../primitives/Point.js';
import Spring from '../../primitives/Spring.js';
import Entity from '../Entity.js';
import StyleFactory from '../../../render/style/StyleFactory.js';

/**
 * A cloth entity generator.
 * @class
 */
class ClothEntity extends Entity {

    /**
     * Creates a new cloth entity.
     * @constructor
     * @param {number} iterations - The number of physics iterations to perform per update. 
     * @param {Vector2} position - The position of the cloth entity.
     * @param {Vector2} size - The overall size of the cloth entity.
     * @param {number} xSegments - The number of horizontal segments of the cloth entity.
     * @param {number} ySegments - The number of vertical segments of the cloth entity.
     * @param {boolean} diagonals - Whether to generate diagonal springs.
     * @param {Vector2} gravity - A constant force affecting the entity's point.
     * @param {FixedPointGenerator} fixedPoints - A generator to determine what points are fixed.
     * @param {MassGenerator} masses - A generator to determine the masses of points. 
     * @param {FrictionGenerator} frictions - A generator to determine the frictions of the points.
     * @param {StiffnessGenerator} stiffness - A generator to determine the stiffness of the springs.
     * @param {PointStyleGenerator} pointStyles - A generator to determine the styles of the points.
     * @param {SpringStyleGenerator} springStyles - A generator to determine the styles of the springs.
     */
    constructor(iterations=8, position=Vector2.zero, size=Vector2.one, xSegments=2, ySegments=2, diagonals=true, gravity=Vector2.down, fixedPoints=(x,y)=>(x % 4 === 0 && y === 0), masses=(x,y)=>1, frictions=(x,y)=>0.03, stiffness=(x,y)=>2, pointStyles=(x,y)=>StyleFactory.DefaultStyle, springStyles=(x,y)=>StyleFactory.DefaultStyle) {
        const p = new Set();
        const sps = new Set();
        super(iterations, p, sps);

        if (!(position instanceof Vector2)) throw new TypeError(`Parameter 'position' expected to be an instance of the Vector2 class.\n(Provided type: ${typeof position})`);
        
        if (!(size instanceof Vector2)) throw new TypeError(`Parameter 'size' expected to be an instance of the Vector2 class.\n(Provided type: ${typeof size})`);
        const dim = Vector2.Min(Vector2.Max(Vector2.Abs(size), Vector2.EPSILON), Vector2.MAX_VALUE);
        if (!size.roughlyEquals(dim, 1e-3)) {
            console.warn(`Value provided for size was invalid, and was adjusted to fit the interval [${Number.EPSILON}, ${Number.MAX_VALUE}].\n(Provided: ${size.toString()}, Adjusted: ${dim.toString()})`);
            console.trace();
        }

        if (typeof xSegments !== 'number') throw new TypeError(`Parameter 'xSegments' expected to be a number.\n(Provided type: ${typeof xSegments})`);
        const xseg = Math.min(Math.max(Math.floor(Math.abs(xSegments)), 2), Number.MAX_SAFE_INTEGER);
        if (xseg !== xSegments) {
            console.warn(`Value provided for xSegments was invalid, and was adjusted to fit the interval [2, ${Number.MAX_SAFE_INTEGER}].\n(Provided: ${xSegments}, Adjusted: ${xseg})`);
            console.trace();
        }

        if (typeof ySegments !== 'number') throw new TypeError(`Parameter 'ySegments' expected to be a number.\n(Provided type: ${typeof ySegments})`);
        const yseg = Math.min(Math.max(Math.floor(Math.abs(ySegments)), 2), Number.MAX_SAFE_INTEGER);
        if (yseg !== ySegments) {
            console.warn(`Value provided for ySegments was invalid, and was adjusted to fit the interval [2, ${Number.MAX_SAFE_INTEGER}].\n(Provided: ${ySegments}, Adjusted: ${yseg})`);
            console.trace();
        }

        if (typeof diagonals !== 'boolean') throw new TypeError(`Parameter 'diagonals' expected to be a boolean.\n(Provided type: ${typeof diagonals})`);

        const segdim = new Vector2(dim.x / xseg, dim.y / yseg);

        if (!(gravity instanceof Vector2)) throw new TypeError(`Parameter 'gravity' expected to be an instance of the Vector2 class.\n(Provided type: ${typeof gravity})`);

        if (typeof fixedPoints !== 'function' || typeof fixedPoints(0, 0) !== 'boolean') throw new TypeError(`Parameter 'fixedPoints' expected to be a function with the identity (number, number) => boolean.\n(Provided type: ${typeof fixedPoints})`);
        if (typeof masses !== 'function' || typeof masses(0, 0) !== 'number') throw new TypeError(`Parameter 'masses' expected to be a function with the identity (number, number) => number.\n(Provided type: ${typeof masses})`);
        if (typeof frictions !== 'function' || typeof frictions(0, 0) !== 'number') throw new TypeError(`Parameter 'frictions' expected to be a function with the identity (number, number) => number.\n(Provided type: ${typeof frictions})`);
        if (typeof stiffness !== 'function' || typeof stiffness(0, 0) !== 'number') throw new TypeError(`Parameter 'stiffness' expected to be a function with the identity (number, number) => number.\n(Provided type: ${typeof stiffness})`);
        if (typeof pointStyles !== 'function' || !(pointStyles(0, 0) instanceof StyleFactory)) throw new TypeError(`Parameter 'pointStyles' expected to be a function with the identity (number, number) => StyleFactory.\n(Provided type: ${typeof pointStyles})`);
        if (typeof springStyles !== 'function' || !(springStyles(0, 0) instanceof StyleFactory)) throw new TypeError(`Parameter 'springStyles' expected to be a function with the identity (number, number) => StyleFactory.\n(Provided type: ${typeof springStyles})`);

        // points
        const pts = {};
        for (let x = 0; x < xseg; x++) {
            pts[x] = {};
            for (let y = 0; y < yseg; y++) {
                pts[x][y] = new Point(
                    fixedPoints(x, y),
                    new Vector2(x, y).mul(segdim).add(position),
                    Vector2.zero,
                    masses(x, y),
                    frictions(x, y),
                    gravity,
                    pointStyles(x, y)
                );
            }
        }

        for (let x = 0; x < xseg; x++) {
            for (let y = 0; y < yseg; y++) {
                const _x = x + 1 < xseg;
                const _y = y + 1 < yseg;
                if (_x) {
                    sps.add(new Spring(
                        pts[x][y],
                        pts[x+1][y],
                        stiffness(x, y),
                        -1,
                        springStyles(x, y)
                    ));
                }
                if (_y) {
                    sps.add(new Spring(
                        pts[x][y],
                        pts[x][y+1],
                        stiffness(x, y),
                        -1,
                        springStyles(x, y)
                    ));
                }
                if (diagonals) {
                    if (_x && _y) {
                        sps.add(new Spring(
                            pts[x][y],
                            pts[x+1][y+1],
                            stiffness(x, y),
                            -1,
                            springStyles(x, y)
                        ));
                        sps.add(new Spring(
                            pts[x+1][y],
                            pts[x][y+1],
                            stiffness(x, y),
                            -1,
                            springStyles(x, y)
                        ));
                    }
                }
            }
        }

        for (let i = 0; i < xSegments * ySegments; i++) {
            p.add(pts[i % xSegments][Math.floor(i / ySegments)]);
        }

    }

}

export default ClothEntity;