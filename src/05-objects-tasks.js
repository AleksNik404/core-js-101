/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  selectors: [],
  selectorsOrder: [],

  idIsUse: false,
  psedoIsUse: false,
  elemIsUse: false,

  order: ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'],

  element(value) {
    if (this.elemIsUse) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.isWrongOrder('element', this.selectorsOrder)) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    const selectors = [...this.selectors];
    const selectorsOrder = [...this.selectorsOrder];
    const newObj = { ...this, selectors, selectorsOrder };

    newObj.elemIsUse = true;
    newObj.selectors.push(`${value}`);
    newObj.selectorsOrder.push('element');

    return newObj;
  },

  id(value) {
    if (this.idIsUse) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.isWrongOrder('id', this.selectorsOrder)) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    const selectors = [...this.selectors];
    const selectorsOrder = [...this.selectorsOrder];
    const newObj = { ...this, selectors, selectorsOrder };

    newObj.idIsUse = true;
    newObj.selectors.push(`#${value}`);
    newObj.selectorsOrder.push('id');

    return newObj;
  },

  class(value) {
    if (this.isWrongOrder('class', this.selectorsOrder)) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    const selectors = [...this.selectors];
    const selectorsOrder = [...this.selectorsOrder];
    const newObj = { ...this, selectors, selectorsOrder };

    newObj.selectors.push(`.${value}`);
    newObj.selectorsOrder.push('class');

    return newObj;
  },

  attr(value) {
    if (this.isWrongOrder('attr', this.selectorsOrder)) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    const selectors = [...this.selectors];
    const selectorsOrder = [...this.selectorsOrder];
    const newObj = { ...this, selectors, selectorsOrder };

    newObj.selectors.push(`[${value}]`);
    newObj.selectorsOrder.push('attr');

    return newObj;
  },

  pseudoClass(value) {
    if (this.isWrongOrder('pseudoClass', this.selectorsOrder)) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    const selectors = [...this.selectors];
    const selectorsOrder = [...this.selectorsOrder];
    const newObj = { ...this, selectors, selectorsOrder };

    newObj.selectors.push(`:${value}`);
    newObj.selectorsOrder.push('pseudoClass');

    return newObj;
  },

  pseudoElement(value) {
    if (this.psedoIsUse) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.isWrongOrder('pseudoElement', this.selectorsOrder)) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    const selectors = [...this.selectors];
    const selectorsOrder = [...this.selectorsOrder];
    const newObj = { ...this, selectors, selectorsOrder };

    newObj.psedoIsUse = true;
    newObj.selectors.push(`::${value}`);
    newObj.selectorsOrder.push('pseudoElement');

    return newObj;
  },

  combine(selector1, combinator, selector2) {
    const selectors = [...selector1.selectors, ` ${combinator} `, ...selector2.selectors];
    return { ...selector1, ...selector2, selectors };
    // return this;
  },

  stringify() {
    return this.selectors.join('');
  },

  isWrongOrder(selector, curOrder) {
    const indexSelector = this.order.indexOf(selector);
    const falsyOrder = this.order.slice(indexSelector + 1);

    if (curOrder.some((el) => falsyOrder.includes(el))) {
      return true;
    }

    return false;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
