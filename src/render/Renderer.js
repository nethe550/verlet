class Renderer {

    constructor(canvas) {
        this.canvas = null;
        if (canvas instanceof HTMLCanvasElement) this.canvas = canvas;
        else if (typeof canvas === 'string') {
            this.canvas = document.querySelector(canvas);
            if (!this.canvas) throw new TypeError(`Expected parameter 'canvas' to be a HTMLCanvasElement or valid CSS query string.\n(canvas: ${typeof canvas === 'object' ? JSON.stringify(canvas, null, 4) : canvas.toString()})`);
        }
        this.ctx = this.canvas.getContext('2d');
    }

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