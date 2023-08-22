import Rectangle from '../util/struct/Rectangle.js';

class Simulation {

    constructor(entities=new Set()) {
        this.entities = entities || new Set();
    }

    update(bounds=Rectangle.one) {
        for (let e of this.entities) {
            e.update(bounds);
        }
    }

    addEntity(e=null) {
        if (e && !this.entities.has(e)) return Boolean(this.entities.add(e));
        else return false;
    }

    addEntities(...e) {
        if (e && e.length > 0) {
            const r = [];
            for (let _e of e) {
                r.push(this.addEntity(_e));
            }
            return r;
        }
        return [];
    }

    removeEntity(e=null) {
        return this.entities.delete(e);
    }

    removeEntities(...e) {
        if (e && e.length > 0) {
            const r = [];
            for (let _e of e) {
                r.push(this.removeEntity(_e));
            }
            return r;
        }
        return [];
    }
    
}

export default Simulation;