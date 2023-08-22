import Color from '../../util/render/Color.js';

class StyleFactory {

    static get DefaultStyle() { 
        return new StyleFactory({
            size: 5,
            fill: Color.white,
            stroke: Color.black,
            thickness: 2
        });
    }

    constructor(styles=StyleFactory.DefaultStyle) {
        this.size = styles.size || 5;
        this.fill = styles.fill || Color.white;
        this.stroke = styles.stroke || Color.black;
        this.thickness = styles.thickness || 2;
    }

    Size(size=5) {
        this.size = size;
        return this;
    }

    Fill(fill=Color.white) {
        this.fill = fill;
        return this;
    }

    Stroke(stroke=Color.black) {
        this.stroke = stroke;
        return this;
    }

    Thickness(thickness=2) {
        this.thickness = thickness;
        return this;
    }

    Copy() { 
        return new StyleFactory({
            size: this.size,
            fill: this.fill,
            stroke: this.stroke,
            thickness: this.thickness
        }); 
    }

}

export default StyleFactory;