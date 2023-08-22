import Vector2 from '../src/util/vector/Vector2.js';
import Color from '../src/util/render/Color.js';

import ClothEntity from '../src/physics/entity/generator/ClothEntity.js';

import StyleFactory from '../src/render/style/StyleFactory.js';

import Verlet from '../src/Verlet.js';
import NGonEntity from '../src/physics/entity/generator/NGonEntity.js';

const psize = 5;
const activeStyle = new StyleFactory().Fill(Color.green).Stroke(Color.blue).Size(psize * 2).Thickness(2);
const fixedStyle = new StyleFactory().Fill(Color.red).Stroke(new Color(128,64,64)).Size(psize);

const v = new Verlet('#sim', false, 60, true, psize * 2, activeStyle, fixedStyle);

const resize = () => {
    v.dimensions = new Vector2(
        Math.floor(2 * (window.innerWidth / 3)),
        Math.floor(2 * (window.innerHeight / 3))
    );
};
resize();

const seg = new Vector2(13, 13);
const size = new Vector2(300, 300);
const position = v.dimensions.mul(new Vector2(1/3, 0.5)).sub(size.mul(0.5)).add(size.div(seg).mul(0.5));

const fixedPoints = (x, y) => (x % 4 === 0 && y === 0);
const pointStyles = (x, y) => fixedPoints(x, y) ? fixedStyle : StyleFactory.DefaultStyle.Size(psize);
const springStyles = (x, y) => new StyleFactory().Stroke(new Color(64,128,64));

const c = new ClothEntity(
    8,
    position,
    size,
    seg.x,
    seg.y,
    false,
    Vector2.down,
    fixedPoints,
    (x, y) => 1,
    (x, y) => 0.03,
    (x, y) => 0.5,
    pointStyles,
    springStyles
);

const n = new NGonEntity(
    8,
    32,
    v.dimensions.mul(new Vector2(0.75, 0.25)),
    0,
    Math.min(v.dimensions.x * 0.2, v.dimensions.y * 0.2),
    8,
    true,
    true,
    Vector2.down,
    1,
    0.03,
    2,
    1,
    StyleFactory.DefaultStyle,
    fixedStyle,
    new StyleFactory().Stroke(new Color(64,128,64)),
    new StyleFactory().Stroke(new Color(128,64,64))
);

v.add(c);
v.add(n);

v.play();