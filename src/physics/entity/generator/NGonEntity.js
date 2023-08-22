import Vector2 from '../../../util/vector/Vector2.js';
import Point from '../../primitives/Point.js';
import Spring from '../../primitives/Spring.js';
import Entity from '../Entity.js';
import StyleFactory from '../../../render/style/StyleFactory.js';

class NGonEntity extends Entity {

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