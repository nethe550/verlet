/**
 * !package nethe-utils
 * 
 * @author nethe550
 * @license MIT
 * @description The Vector2 class.
 */

/**
 * A two-dimensional vector.
 * @class
 */
class Vector2 {

    /**
     * !Appended method not included in package
     */
    static get random() {
        return new Vector2(Math.random(), Math.random());
    }

    /**
     * !Appended method not included in package
     */
    static get randomUnitCircle() {
        return Vector2.random.mul(2).sub(1).normalized;
    }

    /**
     * !Appended method not included in package
     */
    static get EPSILON() {
        return new Vector2(Number.EPSILON, Number.EPSILON);
    }

    static get MAX_VALUE() {
        return new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
    }

    /**
     * A two-dimensional vector with both components initialized to zero.
     * 
     * Vector2(0, 0)
     * @type {Vector2}
     */
    static zero = new Vector2(0, 0);

    /**
     * A two-dimensional vector with both components initialized to one.
     * 
     * Vector2(1, 1)
     * @type {Vector2}
     */
    static one = new Vector2(1, 1);

    /**
     * A two-dimensional unit vector facing up in the inverted Cartesian coordinate system, typically used by computer graphics.
     * 
     * Vector2(0, -1)
     * @type {Vector2}
     */
    static up = new Vector2(0, -1);

    /**
     * A two-dimensional unit vector facing down in the inverted Cartesian coordinate system, typically used by computer graphics.
     * 
     * Vector2(0, 1)
     * @type {Vector2}
     */
    static down = new Vector2(0, 1);

    /**
     * A two-dimensional unit vector facing left in the inverted Cartesian coordinate system, typically used by computer graphics.
     * 
     * Vector2(-1, 0)
     * @type {Vector2}
     */
    static left = new Vector2(-1, 0);

    /**
     * A two-dimensional unit vector facing right in the inverted Cartesian coordinate system, typically used by computer graphics.
     * 
     * Vector2(1, 0)
     * @type {Vector2}
     */
    static right = new Vector2(1, 0);

    /**
     * Creates a new two-dimensional vector.
     * @param {number} x - The x component.
     * @param {number} y - The y component.
     */
    constructor(x, y=null) {
        /**
         * The x component of this vector.
         * @type {number}
         */
        this.x = x;

        /**
         * The y component of this vector.
         * @type {number}
         */
        this.y = y;
    }

    /**
     * Gets the magnitude of this vector.
     * @returns {number} The magnitude of this vector.
     */
    get magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }

    /**
     * Gets the magnitude squared of this vector.
     * @returns {number} The magnitude squared of this vector.
     */
    get sqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Gets the normalized version of this vector.
     * @returns {Vector2} The normalized version of this vector.
     */
    get normalized() {
        const magnitude = this.magnitude;
        if (magnitude > 0) return new Vector2(this.x / magnitude, this.y / magnitude);
        else return Vector2.zero;
    }

    /**
     * Copies this vector's components to a new vector.
     * @returns {Vector2} The copy of this vector.
     */
    copy() {
        return new Vector2(this.x, this.y);
    }

    /**
     * Sets the values of the components of this vector.
     * @param {number} x - The value to set the x component of this vector to.
     * @param {number} y - The value to set the y component of this vector to.
     */
    set(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * ?Modified
     * Adds a value to this vector.
     * @param {Vector2|number} v - The value to add.
     * @returns {Vector2} The sum of the vector and value.
     */
    add(v) {
        return Vector2.Arithmetic(this, v, (a, b) => a + b);
    }

    /**
     * ?Modified
     * Subtracts a value from this vector.
     * @param {Vector2|number} v - The value to subtract.
     * @returns {Vector2} The difference of the vector and value.
     */
    sub(v) {
        return Vector2.Arithmetic(this, v, (a, b) => a - b);
    }

    /**
     * ?Modified
     * Multiplies this vector by a value.
     * @param {Vector2|number} v - The value to multiply by.
     * @returns {Vector2} The product of the vector and value.
     */
    mul(v) {
        return Vector2.Arithmetic(this, v, (a, b) => a * b);
    }

    /**
     * ?Modified
     * Divides this vector by a value.
     * @param {Vector2|number} v - The value to divide by.
     * @returns {Vector2} The quotient of the vector and value.
     */
    div(v) {
        return Vector2.Arithmetic(this, v, (a, b) => a / b);
    }

    /**
     * !Appended method not included in package
     * ?Upgrade
     */
    static Arithmetic(a, b, op=null) {
        if (!op || typeof op !== 'function') throw new TypeError(`Parameter 'op' expected to be a function with the identity (a: number, b: number) => number.`);
        if (a instanceof Vector2) {
            if (b instanceof Vector2) return new Vector2(op(a.x, b.x), op(a.y, b.y));
            else if (typeof b === 'number') return new Vector2(op(a.x, b), op(a.y, b));
            else throw new TypeError(`Parameter 'b' expected to be a Vector2 or number.\n(b: ${typeof b === 'object' ? JSON.stringify(b, null, 4) : b.toString()})`);
        }
        else if (typeof a === 'number') {
            if (b instanceof Vector2) return new Vector2(op(a, b.x), op(a, b.y));
            else if (typeof b === 'number') return op(a, b);
            else throw new TypeError(`Parameter 'b' expected to be a Vector2 or number.\n(b: ${typeof b === 'object' ? JSON.stringify(b, null, 4) : b.toString()})`);
        }
        else throw new TypeError(`Parameter 'a' expected to be a Vector2 or number.\n(a: ${typeof a === 'object' ? JSON.stringify(a, null, 4) : a.toString()})`);
    }

    /**
     * Normalizes this vector.
     */
    normalize() {
        let normalized = this.normalized;
        this.x = normalized.x;
        this.y = normalized.y;
    }

    /**
     * Checks whether this vector is exactly equal to another vector.
     * @param {Vector2} other - The vector to compare to.
     * @returns {boolean} Whether this vector is exactly equal to the other vector.
     */
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Checks whether this vector is equal to another vector within a tolerance (inclusive).
     * @param {Vector2} other - The vector to compare to.
     * @param {number} epsilon - The tolerance between vectors to be considered equal.
     */
    roughlyEquals(other, epsilon=Number.EPSILON) {
        return this.equals(other) || (Math.abs(this.x - other.x) <= epsilon && Math.abs(this.y - other.y) <= epsilon);
    }

    /**
     * Converts this vector to a formatted string.
     * @returns {string} A formatted string representation of this vector.
     */
    toString() {
        return `Vector2( x: ${this.x}, y: ${this.y} )`;
    }

    /**
     * Creates a primitive array from this vector, where index 0 is the x component, and index 1 is the y component.
     * @returns {[number, number]} The primitive array representation of this vector.
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Creates a primitive object from this vector, with properties x and y respectively.
     * @returns {{ x: number, y: number }} The primitive object representation of this vector.
     */
    toObject() {
        return {
            x: this.x,
            y: this.y
        }
    }

    /**
     * Returns a copy of the vector with the magnitude clamped to maxLength.
     * @param {number} maxLength - The maximum magnitude of the new vector.
     * @returns {Vector2} A copy of the vector with the magnitude clamped to maxLength.
     */
    static ClampMagnitude(vector, maxLength) {
        maxLength = Math.abs(maxLength);
        const magnitude = vector.magnitude;
        const factor = Math.min(magnitude, maxLength) / magnitude;
        return new Vector2(vector.x * factor, vector.y * factor);
    }

    /**
     * Calculates the distance squared between two vectors.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The second vector.
     * @returns {number} The distance squared between the two vectors.
     */
    static SqrDistance(vectorA, vectorB) {
        return Math.pow(vectorB.x - vectorA.x, 2) + Math.pow(vectorB.y - vectorA.y, 2);
    }

    /**
     * Calculates the distance between two vectors.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The first vector.
     * @returns {number} The distance between the two vectors.
     */
    static Distance(vectorA, vectorB) {
        return Math.sqrt(Vector2.SqrDistance(vectorA, vectorB));
    }

    /**
     * Calculates the dot product of two vectors.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The second vector.
     * @returns {Vector2} The dot product of the two vectors.
     */
    static Dot(vectorA, vectorB) {
        return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    }

    /**
     * Linearly interpolates between two vectors at point t.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The second vector.
     * @param {number} t - The clamped normalized percentage toward the second vector.
     * @returns {Vector2} The interpolated vector.
     */
    static Lerp(vectorA, vectorB, t) {
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        return Vector2.LerpUnclamped(vectorA, vectorB, t);
    }

    /**
     * Linearly interpolates along the slope defined by the given vectors at point t.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The second vector.
     * @param {number} t - The percentage along the slope defined by the given vectors.
     * @returns {Vector2} The interpolated vector.
     */
    static LerpUnclamped(vectorA, vectorB, t) {
        return new Vector2((1 - t) * vectorA.x + t * vectorB.x, (1 - t) * vectorA.y + t * vectorB.y);
    }

    /**
     * Creates a new vector from the largest components of the two vectors.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The second vector.
     * @returns {Vector2} A new vector with the values of the largest components of the two given vectors.
     */
    static Max(vectorA, vectorB) {
        return new Vector2(Math.max(vectorA.x, vectorB.x), Math.max(vectorA.y, vectorB.y));
    }

    /**
     * Creates a new vector from the smallest components of the two vectors.
     * @param {Vector2} vectorA - The first vector.
     * @param {Vector2} vectorB - The second vector.
     * @returns {Vector2} A new vector with the values of the smallest components of the two given vectors.
     */
    static Min(vectorA, vectorB) {
        return new Vector2(Math.min(vectorA.x, vectorB.x), Math.min(vectorA.y, vectorB.y));
    }

    /**
     * !Appended method not included in package
     */
    static Abs(v) {
        return new Vector2(Math.abs(v.x), Math.abs(v.y));
    }

    /**
     * !Appended method not included in package
     */
    static IsZero(v=Vector2.zero, epsilon=0) {
        if (epsilon === 0) return v.x === 0 && v.y === 0;
        else return Math.abs(v.x) - epsilon <= 0 && Math.abs(v.y) - epsilon <= 0;
    }

}

export default Vector2;