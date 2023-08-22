/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A Verlet integration physics simulator and renderer.
 */

/**
 * @typedef {import('./physics/entity/Entity.js').default} Entity A generic entity consisting of point-masses and springs.
 */

import Vector2 from './util/vector/Vector2.js';
import Rectangle from './util/struct/Rectangle.js';
import StyleFactory from './render/style/StyleFactory.js';

import Simulation from './physics/Simulation.js';
import Renderer from './render/Renderer.js';

import MouseInteraction from './interaction/MouseInteraction.js';

/**
 * A Verlet integration physics simulator and renderer.
 * @class
 */
class Verlet {

    /**
     * The physics simulation.
     * @type {Simulation}
     */
    simulation = null;

    /**
     * The simulation renderer.
     * @type {Renderer}
     */
    renderer = null;

    /**
     * The bounds of the simulation.
     * @type {Rectangle}
     */
    bounds = null;

    /**
     * The TPS of the simulation.
     * @private
     * @type {number}
     */
    _tps = 60;

    /**
     * Whether this simulation is interactable with the mouse.
     * @type {boolean}
     */
    _interactable = true;

    /**
     * The distance at which a point in the simulation can be interacted with by the mouse interation manager.
     * @type {number}
     */
    interactionDistance = 25;

    /**
     * The style used to render the point actively being interacted with by the mouse interaction manager.
     * @type {StyleFactory}
     */
    interactionStyle = StyleFactory.DefaultStyle;

    /**
     * The style used to render points fixed by the mouse interaction manager.
     * @type {StyleFactory}
     */
    interactionFixedStyle = StyleFactory.DefaultStyle;

    /**
     * Whether the simulation is currently simulating.
     * @private
     * @type {boolean}
     */
    _playing = false;

    /**
     * The interval ID of the update loop.
     * @type {number}
     */
    _updateInterval = -1;

    /**
     * The previous frame ID of the render loop.
     * @type {number}
     */
    _renderFrame = -1;

    /**
     * Creates a new physics simulator and renderer.
     * @constructor
     * @param {HTMLCanvasElement|string} canvas - The canvas element or the CSS query selector to render to.
     * @param {boolean} playOnStart - Whether to start the simulation and rendering on creation.
     * @param {number} tps - The TPS, or the number of simulation updates to perform per second.
     * @param {boolean} interactable - Whether the simulation should be interactable with the mouse.
     * @param {number} interactionDistance - The distance at which a point in the simulation can be interacted with by the mouse interaction manager.
     * @param {StyleFactory} interactionStyle - The style used to render the point actively being interacted with by the mouse interaction manager.
     * @param {StyleFactory} interactionFixedStyle - The style used to render points fixed by the mouse interaction manager.
     * @param  {...Entity} entities - (Optional) The entities to be simulated by this simulation.
     */
    constructor(canvas, playOnStart=false, tps=60, interactable=true, interactionDistance=25, interactionStyle=StyleFactory.DefaultStyle, interactionFixedStyle=StyleFactory.DefaultStyle, ...entities) {
        if (!canvas) throw new TypeError(`Parameter 'canvas' must be a HTMLCanvasElement or a valid CSS query string.\n(Provided: ${typeof canvas === 'object' ? JSON.stringify(canvas, null, 4) : canvas.toString()})`);
        this.simulation = new Simulation(...entities);
        this.renderer = new Renderer(canvas);
        this.bounds = new Rectangle(0, 0, this.renderer.canvas.width, this.renderer.canvas.height);
        
        this._tps = 60;
        this.tps = tps;

        this._interactable = interactable;
        if (this._interactable) {
            this.interactionDistance = interactionDistance;
            this.interactionStyle = interactionStyle;
            this.interactionFixedStyle = interactionFixedStyle;
            this.mouseInteraction = new MouseInteraction(this.simulation, this.renderer, this.interactionDistance, this.interactionStyle, this.interactionFixedStyle);
        }

        this._playing = playOnStart;
        this._updateInterval = -1;
        this._renderFrame = -1;
        if (this._playing) this.play();

    }

    /**
     * The TPS, or the number of simulation updates performed per second.
     * @type {number}
     */
    get tps() { return this._tps; }

    /**
     * The TPS, or the number of simulation updates performed per second.
     * @param {number} t - The new TPS value.
     * @type {number}
     */
    set tps(t) {
        if (typeof t === 'number') {
            this._tps = Math.min(Math.max(Math.abs(t), Number.EPSILON), Number.MAX_VALUE);
            if (this._tps !== t) {
                console.warn(`Value provided for TPS was invalid, and was adjusted to fit the interval of [${Number.EPSILON}, ${Number.MAX_VALUE}].\n(Provided: ${t}, Adjusted: ${Math.min(Math.max(Math.abs(t), Number.EPSILON), Number.MAX_VALUE)})`);
                console.trace();
            }
            if (this._playing) {
                this.pause();
                this.play();
            }
        }
    }

    /**
     * Whether the simulation loop is actively running.
     * @type {boolean}
     */
    get playing() { return this._playing; }

    /**
     * Whether the simulation loop is actively running.
     * @param {boolean} p - The new playing state.
     * @type {boolean}
     */
    set playing(p) {
        if (p && !this._playing) this.play();
        else if (!p && this._playing) this.pause();
        else {
            console.warn(`Simulation is already ${this._playing ? 'playing' : 'paused'}.`);
            console.trace();
        }
    }

    /**
     * The dimensions of the simulation bounds and renderer's canvas.
     * @type {Vector2}
     */
    get dimensions() { return new Vector2(this.renderer.canvas.width, this.renderer.canvas.height); }

    /**
     * The dimensions of the simulation bounds and renderer's canvas.
     * @param {Vector2} d - The new dimensions.
     * @type {Vector2}
     */
    set dimensions(d) {
        if (!(d instanceof Vector2)) {
            console.error(`Value provided for dimensions must be an instance of the Vector2 class.\n(Provided: ${typeof d === 'object' ? JSON.stringify(d, null, 4) : d.toString()})`);
            console.trace();
            return;
        }
        const w = Math.min(Math.max(Math.floor(Math.abs(d.x)), 1), Number.MAX_SAFE_INTEGER);
        const h = Math.min(Math.max(Math.floor(Math.abs(d.y)), 1), Number.MAX_SAFE_INTEGER);
        if (d.x !== w || d.y !== h) {
            if (d.x !== w) console.warn(`Value provided for width (x) was invalid, and was adjusted to fit the interval of [1, ${Number.MAX_SAFE_INTEGER}].\n(Provided: ${d.x}, Adjusted: ${w})`);
            if (d.y !== h) console.warn(`Value provided for height (y) was invalid, and was adjusted to fit the interval of [1, ${Number.MAX_SAFE_INTEGER}].\n(Provided: ${d.y}, Adjusted: ${h})`);
            console.trace();
        }
        this.renderer.canvas.width = w;
        this.renderer.canvas.height = h;
        this.bounds.w = w;
        this.bounds.h = h;
        this.render();
    }

    /**
     * The width of the simulation bounds and renderer's canvas.
     * @type {number}
     */
    get width() { return this.renderer.canvas.width; }

    /**
     * The height of the simulation bounds and renderer's canvas.
     * @type {number}
     */
    get height() { return this.renderer.canvas.height; }

    /**
     * The width of the simulation bounds and renderer's canvas.
     * @param {number} w - The new width.
     * @type {number}
     */
    set width(w) {
        if (typeof w !== 'number') {
            console.error(`Value provided for width must be a number.\n(Provided type: ${typeof w})`);
            console.trace();
            return;
        }
        const _w = Math.min(Math.max(Math.floor(Math.abs(w)), 1), Number.MAX_SAFE_INTEGER);
        this.dimensions = new Vector2(_w, this.renderer.canvas.height);
    }

    /**
     * The width of the simulation bounds and renderer's canvas.
     * @param {number} h - The new height.
     * @type {number}
     */
    set height(h) {
        if (typeof h !== 'number') {
            console.error(`Value provided for height must be a number.\n(Provided type: ${typeof h})`);
            console.trace();
            return;
        }
        const _h = Math.min(Math.max(Math.floor(Math.abs(h)), 1), Number.MAX_SAFE_INTEGER);
        this.dimensions = new Vector2(this.renderer.canvas.width, _h);
    }

    /**
     * Whether this simulation is interactable by mouse.
     * @type {boolean}
     */
    get interactable() { return this._interactable; }

    /**
     * Whether this simulation is interactable by mouse.
     * @param {boolean} i - The new interactable state.
     * @type {boolean}
     */
    set interactable(i) {
        if (typeof i !== 'boolean') {
            console.error(`Value provided for interactable must be a boolean value.\n(Provided type: ${typeof i})`);
            console.trace();
            return;
        }
        if (i && !this._interactable) {
            this.interactionDistance = 25;
            this.interactionStyle = StyleFactory.DefaultStyle;
            this.interactionFixedStyle = StyleFactory.DefaultStyle;
            this.mouseInteraction = new MouseInteraction(this.simulation, this.renderer, this.interactionDistance, this.interactionStyle, this.interactionFixedStyle);
            this._interactable = true;
        }
        else if (!i && this._interactable) {
            this.mouseInteraction = null;
            this._interactable = false;
        }
        this._renderFrame = requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Adds new entities to this simulation.
     * @param  {...Entity} e - The entities to add.
     * @returns {Array<boolean>} The success states of the added entities.
     */
    add(...e) {
        const r = this.simulation.addEntities(...e);
        this.render();
        return r;
    }

    /**
     * Removes entities from this simulation.
     * @param  {...Entity} e - The entities to remove.
     * @returns {Array<boolean>} The success states of the removed entities.
     */
    remove(...e) {
        return this.simulation.removeEntities(...e);
    }

    /**
     * Updates the entities in this simulation and, if enabled, the mouse interaction logic.
     * @returns {void}
     */
    update() {
        this.simulation.update(this.bounds);
        if (this._interactable) this.mouseInteraction.drag();
    }

    /**
     * Renders the entities in this simulation and, if enabled, the active point controlled by the mouse interaction logic.
     * @returns {void}
     */
    render() {
        this.renderer.render(this.simulation);
        if (this._interactable) this.mouseInteraction.renderActivePoint();
        if (this._playing) this._renderFrame = requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Starts the simulation and render loops.
     * @returns {void}
     */
    play() {
        if (!this._playing) {
            if (this._updateInterval === -1) this._updateInterval = setInterval(this.update.bind(this), 1000 / this.tps);
            else {
                console.error(`Unable to start new update interval! (Current interval: ${this._updateInterval})`);
                return console.trace();
            }
            
            if (this._renderFrame === -1) this._renderFrame = requestAnimationFrame(this.render.bind(this));
            else {
                console.error(`Unable to start new render frame! (Current frame: ${this._renderFrame})`);
                return console.trace();
            }
            
            this._playing = true;
        }
        else {
            console.warn('Attempting to play simulation while it is already playing!');
            console.trace();
        }
    }

    /**
     * Pauses the simulation and render loops.
     * @returns {void}
     */
    pause() {
        if (this._playing) {
            if (this._updateInterval !== -1) {
                clearInterval(this._updateInterval);
                this._updateInterval = -1;
            }
            else {
                console.error(`Unable to pause update interval! (Interval: ${this._updateInterval})`);
                return console.trace();
            }

            if (this._renderFrame !== -1) {
                cancelAnimationFrame(this._renderFrame);
                this._renderFrame = -1;
            }
            else {
                console.error(`Unable to pause render frame! (Frame: ${this._renderFrame})`);
                return console.trace();
            }
            
            this._playing = false;
        }
        else {
            console.warn('Attempting to pause simulation while it is already paused!');
            console.trace();
        }
    }

}

export default Verlet;