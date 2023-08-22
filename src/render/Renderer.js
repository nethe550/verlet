/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A Verlet simulation renderer.
 */

/**
 * @typedef {import('../physics/Simulation.js').default} Simulation - A Verlet integration physics simulation.
 */

/**
 * A Verlet simulation renderer.
 * @class
 */
class Renderer {

    /**
     * The canvas to render to.
     * @type {HTMLCanvasElement}
     */
    canvas = null;

    /**
     * The rendering context that this renderer draws to.
     * @type {CanvasRenderingContext2D}
     */
    ctx = null;

    /**
     * Creates a new simulation renderer.
     * @constructor
     * @throws {TypeError}
     * @param {HTMLCanvasElement|string} canvas - The canvas element or the CSS query selector to render to.
     */
    constructor(canvas) {
        this.canvas = null;
        if (canvas instanceof HTMLCanvasElement) this.canvas = canvas;
        else if (typeof canvas === 'string') {
            this.canvas = document.querySelector(canvas);
            if (!this.canvas) throw new TypeError(`Expected parameter 'canvas' to be a HTMLCanvasElement or valid CSS query selector.\n(canvas: ${typeof canvas === 'object' ? JSON.stringify(canvas, null, 4) : canvas.toString()})`);
        }
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Renders all entities in the a simulation to this rendering context.
     * @param {Simulation} simulation - The simulation to render.
     * @returns {void}
     */
    render(simulation=null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (simulation.entities.size !== 0) {
            for (let e of simulation.entities) {
                e.render(this.ctx);
            }
        }
    }

}

export default Renderer;