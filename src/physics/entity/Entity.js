class Entity {

    constructor(iterations=32, points=new Set(), springs=new Set()) {
        this._iterations = Math.max(Math.floor(Math.abs(iterations)), 1);
        this.points = points instanceof Set ? points : Array.isArray(points) ? new Set(points) : new Set();
        this.springs = springs instanceof Set ? springs : Array.isArray(springs) ? new Set(springs) : new Set();
    }

    get iterations() { return this._iterations; }
    set iterations(i) { this._iterations = Math.max(Math.floor(Math.abs(i)), 1); }

    addPoint(p=null) {
        if (p && !this.points.has(p)) return Boolean(this.points.add(p));
        else return false;
    }

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

    removePoint(p=null) {
        return this.points.delete(p);
    }

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

    addSpring(s=null) {
        if (s && !this.springs.has(s)) return Boolean(this.springs.add(s));
        else return false;
    }

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

    removeSpring(s=null) {
        return this.springs.delete(s);
    }

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

    render(ctx) {
        if (this.points.length === 0) return;

        if (this.springs.length !== 0) {
            for (let s of this.springs) { s.render(ctx); }
        }
        
        for (let p of this.points) { p.render(ctx); }
    }

}

export default Entity;