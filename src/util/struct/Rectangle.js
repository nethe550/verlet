import Vector2 from '../vector/Vector2.js';

class Rectangle {

    static get one() { return new Rectangle(0, 0, 1, 1); }

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get position() { return new Vector2(this.x, this.y); }
    get size() { return new Vector2(this.w, this.h); }

    insideColumn(p=Vector2.zero) {
        return p.x >= this.x && p.x <= this.x + this.w;
    }

    insideRow(p=Vector2.zero) {
        return p.y >= this.y && p.y <= this.y + this.h
    }

    inside(p=Vector2.zero) {
        return this.insideColumn(p) && this.insideRow(p);
    }

    relative(p=Vector2.zero) {
        return p.mul(this.size).add(this.position);
    }

    constrain(p=Vector2.zero, offset=0) {
        return Rectangle.Constrain(p, this, offset);
    }

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