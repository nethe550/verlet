import Vector2 from '../util/vector/Vector2.js';
import Color from '../util/render/Color.js';
import StyleFactory from '../render/style/StyleFactory.js';

class MouseInteraction {

    constructor(simulation, renderer, interactionDistance=20, activeStyle=StyleFactory.DefaultStyle, fixedStyle=StyleFactory.DefaultStyle) {
        this.simulation = simulation;
        this.renderer = renderer;
        this.interactionDistance = interactionDistance;
        this.activeStyle = activeStyle;
        this._prevFixedStyle = null;
        this.fixedStyle = fixedStyle instanceof StyleFactory ? fixedStyle : StyleFactory.DefaultStyle;

        this.activePoint = null;
        
        this.mouse = {
            position: Vector2.zero,
            offset: Vector2.zero,
            offsetPosition: Vector2.zero,
            down: false
        };

        this._register();
    }

    _register() {
        this.renderer.canvas.oncontextmenu = e => false;

        this.renderer.canvas.addEventListener('mousedown', e => {
            this.mouse.down = true;
            if (this.activePoint) {
                if (e.button === 2) { // right click
                    if (!this.activePoint.fixed) this._prevFixedStyle = this.activePoint.style;
                    this.activePoint.fixed = !this.activePoint.fixed;
                    if (this.activePoint.fixed) this.activePoint.style = this.fixedStyle;
                    else this.activePoint.style = this._prevFixedStyle;
                }
                this.mouse.offset = new Vector2(e.offsetX, e.offsetY).sub(this.activePoint.position);
                this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
            }
        });

        this.renderer.canvas.addEventListener('mousemove', e => {
            this.mouse.position.set(e.offsetX, e.offsetY);
            this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
        });

        this.renderer.canvas.addEventListener('mouseup', e => {
            if (this.activePoint) this.activePoint.clearVelocity();
            this.mouse.down = false;
            this.activePoint = null;
        });

        this.renderer.canvas.addEventListener('touchstart', e => {
            const offset = e.touches[0];
            this.mouse.down = true;
            if (this.activePoint) {
                this.mouse.offset = new Vector2(offset.offsetX, offset.offsetY).sub(this.activePoint.position);
                this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
            }
        });

        this.renderer.canvas.addEventListener('touchmove', e => {
            const offset = e.touches[0];
            this.mouse.position.set(offset.pageX, offset.pageY);
            this.mouse.offsetPosition = this.mouse.position.sub(this.mouse.offset);
        });

        this.renderer.canvas.addEventListener('touchend', e => {
            if (this.activePoint) this.activePoint.clearVelocity();
            this.mouse.down = false;
            this.activePoint = null;
        });
    }

    dragPoint() {
        if (!this.mouse.down) return;
        this.activePoint.position.set(this.mouse.offsetPosition.x, this.mouse.offsetPosition.y);
    }

    drag() {
        if (!this.mouse.down) this.activePoint = this.getNearestPoint();
        if (this.activePoint) this.dragPoint();
    }

    renderActivePoint() {
        if (!this.activePoint) return;
        this.renderer.ctx.fillStyle = this.activeStyle.fill.css;
        this.renderer.ctx.strokeStyle = this.activeStyle.stroke.css;
        this.renderer.ctx.lineWidth = this.activePoint.style.thickness;
        this.renderer.ctx.beginPath();
        this.renderer.ctx.arc(this.activePoint.position.x, this.activePoint.position.y, this.activeStyle.size, 0, Math.PI * 2, false);
        this.renderer.ctx.stroke();
        this.renderer.ctx.closePath();
    }

    getNearestPoint() {
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