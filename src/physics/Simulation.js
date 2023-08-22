/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A Verlet integration physics simulation.
 */

/**
 * @typedef {import('./entity/Entity.js').default} Entity A generic entity consisting of point-masses and springs.
 */

import Rectangle from '../util/struct/Rectangle.js';

/**
 * A Verlet integration physics simulation.
 * @class
 */
class Simulation {

    /**
     * The collection of simulated entities.
     * @type {Set}
     */
    entities = new Set();

    /**
     * Creates a new Verlet simulation.
     * @constructor
     * @param {Set|null} entities - (Optional) The entities to be simulated.
     */
    constructor(entities=new Set()) {
        this.entities = entities || new Set();
    }

    /**
     * Updates the entities in this simulation.
     * @param {Rectangle} bounds - The bounds of the simulation.
     * @returns {void}
     */
    update(bounds=Rectangle.one) {
        if (this.entities.size() === 0) return;
        for (let e of this.entities) {
            e.update(bounds);
        }
    }

    /**
     * Adds an entity to this simulation.
     * @param {Entity} e - The entity to add.
     * @returns {boolean} Whether the entity was successfully added.
     */
    addEntity(e=null) {
        if (e && !this.entities.has(e)) return Boolean(this.entities.add(e));
        else return false;
    }

    /**
     * Adds entities to this simulation.
     * @param  {...Entity} e - The entities to add.
     * @returns {Array<boolean>} The success states of the added entities.
     */
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

    /**
     * Removes an entity from this simulation.
     * @param {Entity} e - The entity to remove. 
     * @returns {boolean} Whether the entity existed and was removed (true), or was ignored (false).
     */
    removeEntity(e=null) {
        return this.entities.delete(e);
    }

    /**
     * Removes entities from this simulation.
     * @param  {...Entity} e - The entities to remove.
     * @returns {Array<boolean>} The success states of the removed entities.
     */
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