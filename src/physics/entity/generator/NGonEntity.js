/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A n-gon entity generator.
 */

import Vector2 from '../../../util/vector/Vector2.js';
import Point from '../../primitives/Point.js';
import Spring from '../../primitives/Spring.js';
import Entity from '../Entity.js';
import StyleFactory from '../../../render/style/StyleFactory.js';

/**
 * A n-gon entity generator.
 * @class
 */
class NGonEntity extends Entity {

    /**
     * Creates a new n-gon entity.
     * @constructor
     * @param {number} iterations - The number of physics iterations to perform per update. 
     * @param {number} n - The number of points / sides to generate.
     * @param {boolean} origin - The position of the center of the n-gon.
     * @param {number} rotation - The point offset rotation from Vector2.right.
     * @param {number} radius - The radius of the n-gon.
     * @param {number} maxBranchLength - The maximum number of points between supporting springs.
     * @param {boolean} spokes - Whether to generate spokes (and in turn the origin point).
     * @param {boolean} fixedOrigin - Whether the origin should be fixed.
     * @param {Vector2} gravity - A constant force affecting the entity.
     * @param {number} mass - The mass of the generated points.
     * @param {number} friction - The global fricition of the generated points.
     * @param {number} skinStiffness - The stiffness of the outermost generated springs.
     * @param {number} spokeStiffness - The stiffness of the spoke springs.
     * @param {StyleFactory} pointStyle - The style of the outermost generated points.
     * @param {StyleFactory} originStyle - The style of the origin point.
     * @param {StyleFactory} skinStyle - The style of the outermost generated springs.
     * @param {StyleFactory} spokeStyle - The style of the generated spoke springs.
     */
    constructor(iterations=8, n=16, origin=Vector2.zero, rotation=0, radius=60, maxBranchLength=3, spokes=true, fixedOrigin=true, gravity=Vector2.down, mass=1, friction=0.03, skinStiffness=1, spokeStiffness=2, pointStyle=StyleFactory.DefaultStyle, originStyle=StyleFactory.DefaultStyle, skinStyle=StyleFactory.DefaultStyle, spokeStyle=StyleFactory.DefaultStyle) {
        const p = new Set();
        const s = new Set();
        super(iterations, p, s);

        const PI2 = Math.PI * 2;

        const skin = [];
        for (let θ = rotation; θ < PI2 + rotation; θ += PI2 / n) {
            skin.push(new Point(
                false,
                origin.add(new Vector2(Math.cos(θ), Math.sin(θ)).mul(radius)),
                Vector2.zero,
                mass,
                friction,
                gravity,
                pointStyle
            ));
        }

        for (let i = 0; i < skin.length; i++) {
            s.add(new Spring(
                skin[i],
                skin[(i+1) % (skin.length)],
                skinStiffness,
                -1,
                skinStyle
            ));
        }
        s.add(new Spring(
            skin[skin.length - 1],
            skin[0],
            skinStiffness,
            -1,
            skinStyle
        ));

        const mble = maxBranchLength % 2 === 0;
        const ne = n % 2 === 0;
        if ((mble && ne) || (!mble && !ne)) {
            if (maxBranchLength <= Math.floor(skin.length / 2)) {
                for (let i = 0; i < skin.length; i++) {
                    s.add(new Spring(
                        skin[i],
                        skin[(i+maxBranchLength) % n],
                        skinStiffness,
                        -1,
                        skinStyle
                    ));
                }
                
            }
        }

        if (spokes) {
            const o = new Point(
                fixedOrigin,
                origin,
                Vector2.zero,
                mass,
                friction,
                gravity,
                originStyle
            );
    
            p.add(o);

            skin.forEach(point => {
                s.add(new Spring(
                    o,
                    point,
                    spokeStiffness,
                    -1,
                    spokeStyle
                ));
            });
        }

        skin.forEach(point => p.add(point));

    }

}

export default NGonEntity;