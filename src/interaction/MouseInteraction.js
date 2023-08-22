/**
 * @author nethe550
 * @license GPL-3.0-only
 * @description A mouse-controlled simulation interaction manager.
 */

/**
 * @typedef {import('../physics/Simulation.js').default} Simulation A Verlet integration physics simulation.
 * @typedef {import('../render/Renderer.js').default} Renderer A Verlet simulation renderer.
 * @typedef {import('../physics/primitives/Point.js').default} Point A point mass.
 */

import Vector2 from '../util/vector/Vector2.js';
import StyleFactory from '../render/style/StyleFactory.js';

/**
 * A mouse-controlled simulation interaction manager.
 * @class
 */
class MouseInteraction {

    /**
     * The simulation this interaction manager interacts with.
     * @type {Simulation}
     */
    simulation = null;

    /**
     * The renderer that this interaction manager renders to.
     * @type {Renderer}
     */
    renderer = null;

    /**
     * The distance at which a point in the simulation can be interacted with.
     * @type {number}
     */
    interactionDistance = 20;

    /**
     * The style used to render the point actively being interacted with.
     * @type {StyleFactory}
     */
    activeStyle = StyleFactory.DefaultStyle;

    /**
     * The style used to render points fixed by this interaction manager.
     * @type {StyleFactory}
     */
    fixedStyle = StyleFactory.DefaultStyle;

    /**
     * The previous style of a recently fixed point.
     * @private
     * @type {StyleFactory}
     */
    _prevFixedStyle = null;

    /**
     * The point being currently interacted with.
     * @private
     * @type {Point}
     */
    _activePoint = null;

    /**
     * Creates a new mouse-controlled simulation interaction manager.
     * @constructor
     * @param {Simulation} simulation - The simulation to interact with.
     * @param {Renderer} renderer - The renderer to render interactions to.
     * @param {number} interactionDistance - The distance at which a point in the simulation can be interacted with.
     * @param {StyleFactory} activeStyle - The style used to render the point actively being interacted with.
     * @param {StyleFactory} fixedStyle - The style used to render points fixed by this interaction manager.
     */
    constructor(simulation, renderer, interactionDistance=20, activeStyle=StyleFactory.DefaultStyle, fixedStyle=StyleFactory.DefaultStyle) {
        this.simulation = simulation;
        this.renderer = renderer;
        this.interactionDistance = interactionDistance;
        this.activeStyle = activeStyle;
        this.fixedStyle = fixedStyle instanceof StyleFactory ? fixedStyle : StyleFactory.DefaultStyle;
        this._prevFixedStyle = null;

        this._activePoint = null;
        
        /**
         * Relevant mouse information used to manage interaction state.
         * @private
         * @type {{ position: Vector2, offset: Vector2, offsetPosition: Vector2, down: boolean }}
         */
        this.mouse = {
            position: Vector2.zero,
            offset: Vector2.zero,
            offsetPosition: Vector2.zero,
            down: false
        };

        this._register();
    }

    /**
     * Registers mouse and touch events on the renderer's canvas to enable interaction.
     * @private
     * @returns {void}
     */
    _register() {
        this.renderer.canvas.oncontextmenu = e => false;

        this.renderer.canvas.addEventListener('mousedown', e => {
            this.mouse.down = true;
            if (this._activePoint) {
                if (e.button === 2) { // right click
                    if (!this._activePoint.fixed) this._prevFixedStyle = this._activePoint.style;
                    this._activePoint.fixed = !this._activePoint.fixed;
                    if (this._activePoint.fixed) this._activePoint.style = this.fixedStyle;
                    else this._activePoint.style = this._prevFixedStyle;
                }
                this.mouse.offset = new Vector2(e.offsetX, e.offsetY).sub(this._activePoint.position);
                this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
            }
        });

        this.renderer.canvas.addEventListener('mousemove', e => {
            this.mouse.position.set(e.offsetX, e.offsetY);
            this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
        });

        this.renderer.canvas.addEventListener('mouseup', e => {
            if (this._activePoint) this._activePoint.clearVelocity();
            this.mouse.down = false;
            this._activePoint = null;
        });

        this.renderer.canvas.addEventListener('touchstart', e => {
            const offset = e.touches[0];
            this.mouse.down = true;
            if (this._activePoint) {
                this.mouse.offset = new Vector2(offset.offsetX, offset.offsetY).sub(this._activePoint.position);
                this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
            }
        });

        this.renderer.canvas.addEventListener('touchmove', e => {
            const offset = e.touches[0];
            this.mouse.position.set(offset.pageX, offset.pageY);
            this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
        });

        this.renderer.canvas.addEventListener('touchend', e => {
            if (this._activePoint) this._activePoint.clearVelocity();
            this.mouse.down = false;
            this._activePoint = null;
        });
    }

    /**
     * Moves the active point to the current mouse position.
     * @private
     * @returns {void} 
     */
    dragPoint() {
        if (!this.mouse.down) return;
        this._activePoint.position.set(this.mouse.offsetPosition.x, this.mouse.offsetPosition.y);
    }

    /**
     * Attempts to get the nearest point in the simulation, and if one is found, moves that point to the current mouse position.
     * @returns {void}
     */
    drag() {
        if (!this.mouse.down) this._activePoint = this.getNearestPoint();
        if (this._activePoint) this.dragPoint();
    }

    /**
     * Renders the active point to the renderer's canvas.
     * @returns {void}
     */
    renderActivePoint() {
        if (!this._activePoint) return;
        this.renderer.ctx.fillStyle = this.activeStyle.fill.css;
        this.renderer.ctx.strokeStyle = this.activeStyle.stroke.css;
        this.renderer.ctx.lineWidth = this._activePoint.style.thickness;
        this.renderer.ctx.beginPath();
        this.renderer.ctx.arc(this._activePoint.position.x, this._activePoint.position.y, this.activeStyle.size, 0, Math.PI * 2, false);
        this.renderer.ctx.stroke();
        this.renderer.ctx.closePath();
    }

    /**
     * Gets the nearest point to the current mouse position, within the interaction distance.
     * @returns {Point|null}
     */
    getNearestPoint() {
        if (this.simulation.entities.size() === 0) return null;
        let point = null;
        for (let e of this.simulation.entities) {
            for (let p of e.points) {
                if (Vector2.Distance(this.mouse.position, p.position) < this.interactionDistance) point = p;
            }
        }
        return point;
    }

}

export default MouseInteraction;