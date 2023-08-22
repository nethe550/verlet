import Vector2 from '../../util/vector/Vector2.js';
import StyleFactory from '../../render/style/StyleFactory.js';

class Spring {

    constructor(a=null, b=null, stiffness=2, restLength=-1, style=StyleFactory.DefaultStyle) {
        this.a = a;
        this.b = b;
        this._stiffness = Math.max(Math.abs(stiffness), Number.EPSILON);
        this._restLength = restLength === -1 ? Vector2.Distance(this.a.position, this.b.position) : Math.max(Math.abs(restLength), Number.EPSILON);
        this.style = Object.assign({}, StyleFactory.DefaultStyle, style);
    }

    get stiffness() { return this._stiffness; }
    set stiffness(s) { this._stiffness = Math.max(Math.abs(s), Number.EPSILON); }

    get restLength() { return this._restLength; }
    set restLength(rl) { this._restLength = Math.max(Math.abs(rl), Number.EPSILON); }

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