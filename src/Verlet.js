import Vector2 from './util/vector/Vector2.js';
import Color from './util/render/Color.js';
import Rectangle from './util/struct/Rectangle.js';
import StyleFactory from './render/style/StyleFactory.js';

import Simulation from './physics/Simulation.js';
import Renderer from './render/Renderer.js';

import MouseInteraction from './interaction/MouseInteraction.js';

class Verlet {

    constructor(canvas, playOnStart=false, tps=60, interactable=true, interactionDistance=25, interactionColor=Color.blue, interactionFixedStyle=StyleFactory.DefaultStyle, ...entities) {
        if (!canvas) throw new TypeError(`Parameter 'canvas' must be a HTMLCanvasElement or a valid CSS query string.\n(Provided: ${typeof canvas === 'object' ? JSON.stringify(canvas, null, 4) : canvas.toString()})`);
        this.simulation = new Simulation(...entities);
        this.renderer = new Renderer(canvas);
        this.bounds = new Rectangle(0, 0, this.renderer.canvas.width, this.renderer.canvas.height);
        
        this._tps = 60;
        this.tps = tps;

        this._interactable = interactable;
        if (this._interactable) {
            this.interactionDistance = interactionDistance;
            this.interactionColor = interactionColor;
            this.interactionFixedStyle = interactionFixedStyle;
            this.mouseInteraction = new MouseInteraction(this.simulation, this.renderer, this.interactionDistance, this.interactionColor, this.interactionFixedStyle);
        }

        this._playing = playOnStart;
        this._updateInterval = -1;
        this._renderFrame = -1;
        if (this._playing) this.play();

    }

    get tps() { return this._tps; }
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

    get playing() { return this._playing; }
    set playing(p) {
        if (p && !this._playing) this.play();
        else if (!p && this._playing) this.pause();
        else {
            console.warn(`Simulation is already ${this._playing ? 'playing' : 'paused'}.`);
            console.trace();
        }
    }

    get dimensions() { return new Vector2(this.renderer.canvas.width, this.renderer.canvas.height); }
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

    get width() { return this.renderer.canvas.width; }
    get height() { return this.renderer.canvas.height; }

    set width(w) {
        if (typeof w !== 'number') {
            console.error(`Value provided for width must be a number.\n(Provided type: ${typeof w})`);
            console.trace();
            return;
        }
        const _w = Math.min(Math.max(Math.floor(Math.abs(w)), 1), Number.MAX_SAFE_INTEGER);
        this.dimensions = new Vector2(_w, this.renderer.canvas.height);
    }
    set height(h) {
        if (typeof h !== 'number') {
            console.error(`Value provided for height must be a number.\n(Provided type: ${typeof h})`);
            console.trace();
            return;
        }
        const _h = Math.min(Math.max(Math.floor(Math.abs(h)), 1), Number.MAX_SAFE_INTEGER);
        this.dimensions = new Vector2(this.renderer.canvas.width, _h);
    }

    get interactable() { return this._interactable; }
    set interactable(i) {
        if (typeof i !== 'boolean') {
            console.error(`Value provided for interactable must be a boolean value.\n(Provided type: ${typeof i})`);
            console.trace();
            return;
        }
        if (i && !this._interactable) {
            this.interactionDistance = 25;
            this.interactionColor = Color.blue;
            this.interactionFixedStyle = StyleFactory.DefaultStyle;
            this.mouseInteraction = new MouseInteraction(this.simulation, this.renderer, this.interactionDistance, this.interactionColor, this.interactionFixedStyle);
            this._interactable = true;
        }
        else if (!i && this._interactable) {
            this.mouseInteraction = null;
            this._interactable = false;
        }
        this._renderFrame = requestAnimationFrame(this.render.bind(this));
    }

    add(...e) {
        const r = this.simulation.addEntities(...e);
        this.render();
        return r;
    }

    remove(...e) {
        return this.simulation.removeEntities(...e);
    }

    update() {
        this.simulation.update(this.bounds);
        if (this._interactable) this.mouseInteraction.drag();
    }

    render() {
        this.renderer.render(this.simulation);
        if (this._interactable) this.mouseInteraction.renderActivePoint();
        if (this._playing) this._renderFrame = requestAnimationFrame(this.render.bind(this));
    }

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