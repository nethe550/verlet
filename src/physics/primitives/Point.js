import Vector2 from '../../util/vector/Vector2.js';
import StyleFactory from '../../render/style/StyleFactory.js';

class Point {

    constructor(fixed=false, position=Vector2.zero, velocity=Vector2.zero, mass=1, friction=0.03, gravity=Vector2.down, style=StyleFactory.DefaultStyle) {
        this.fixed = fixed;
        this.position = position;
        this._dpos = velocity && !Vector2.IsZero(velocity) ? this.position.add(velocity) : this.position.copy();
        this._mass = Math.min(Math.max(Number.EPSILON, Math.abs(mass)), Number.MAX_VALUE);
        this._friction = Math.min(Math.max(friction, 0), 1);
        this.gravity = gravity;
        this.style = Object.assign({}, StyleFactory.DefaultStyle, style);
    }

    get friction() { return this._friction; }
    set friction(f) { this._friction = Math.min(Math.max(f, 0), 1); }

    get mass() { return this._mass; }
    set mass(m) { this._mass = Math.min(Math.max(Number.EPSILON, Math.abs(m)), Number.MAX_VALUE); }

    clearVelocity() {
        this._dpos.set(this.position.x, this.position.y);
    }

    update() {
        if (this.fixed) return;
        let velocity = this.position.sub(this._dpos).mul(1 - this._friction);
        this._dpos.set(this.position.x, this.position.y);
        this.position = this.position.add(velocity).add(this.gravity);
    }

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