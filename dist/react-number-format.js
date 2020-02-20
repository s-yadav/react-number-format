/**
 * react-number-format - 4.3.1
 * Author : Sudhanshu Yadav
 * Copyright (c) 2016, 2019 to Sudhanshu Yadav, released under the MIT license.
 * https://github.com/s-yadav/react-number-format
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.NumberFormat = factory(global.React));
}(this, (React) => { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];

        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  const ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  const ReactPropTypesSecret_1 = ReactPropTypesSecret;

  function emptyFunction() {}
  function emptyFunctionWithReset() {}
  emptyFunctionWithReset.resetWarningCache = emptyFunction;

  const factoryWithThrowingShims = function() {
    function shim(props, propName, componentName, location, propFullName, secret) {
      if (secret === ReactPropTypesSecret_1) {
        // It is still safe when called from React.
        return;
      }
      const err = new Error(
        'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
      );
      err.name = 'Invariant Violation';
      throw err;
    }  shim.isRequired = shim;
    function getShim() {
      return shim;
    }  // Important!
    // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
    const ReactPropTypes = {
      array: shim,
      bool: shim,
      func: shim,
      number: shim,
      object: shim,
      string: shim,
      symbol: shim,

      any: shim,
      arrayOf: getShim,
      element: shim,
      elementType: shim,
      instanceOf: getShim,
      node: shim,
      objectOf: getShim,
      oneOf: getShim,
      oneOfType: getShim,
      shape: getShim,
      exact: getShim,

      checkPropTypes: emptyFunctionWithReset,
      resetWarningCache: emptyFunction
    };

    ReactPropTypes.PropTypes = ReactPropTypes;

    return ReactPropTypes;
  };

  const propTypes = createCommonjsModule((module) => {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims();
  }
  });

  // basic noop function
  function noop() {}
  function returnTrue() {
    return true;
  }
  function charIsNumber(char) {
    return !!(char || '').match(/\d/);
  }
  function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  }
  function getThousandsGroupRegex(thousandsGroupStyle) {
    switch (thousandsGroupStyle) {
      case 'lakh':
        return /(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g;

      case 'wan':
        return /(\d)(?=(\d{4})+(?!\d))/g;

      case 'thousand':
      default:
        return /(\d)(?=(\d{3})+(?!\d))/g;
    }
  }
  function applyThousandSeparator(str, thousandSeparator, thousandsGroupStyle) {
    const thousandsGroupRegex = getThousandsGroupRegex(thousandsGroupStyle);
    let index = str.search(/[1-9]/);
    index = index === -1 ? str.length : index;
    return str.substring(0, index) + str.substring(index, str.length).replace(thousandsGroupRegex, '$1' + thousandSeparator);
  } //spilt a float number into different parts beforeDecimal, afterDecimal, and negation

  function splitDecimal(numStr) {
    const allowNegative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    const hasNagation = numStr[0] === '-';
    const addNegation = hasNagation && allowNegative;
    numStr = numStr.replace('-', '');
    const parts = numStr.split('.');
    const beforeDecimal = parts[0];
    const afterDecimal = parts[1] || '';
    return {
      beforeDecimal: beforeDecimal,
      afterDecimal: afterDecimal,
      hasNagation: hasNagation,
      addNegation: addNegation
    };
  }
  function fixLeadingZero(numStr) {
    if (!numStr) return numStr;
    const isNegative = numStr[0] === '-';
    if (isNegative) numStr = numStr.substring(1, numStr.length);
    const parts = numStr.split('.');
    const beforeDecimal = parts[0].replace(/^0+/, '') || '0';
    const afterDecimal = parts[1] || '';
    return "".concat(isNegative ? '-' : '').concat(beforeDecimal).concat(afterDecimal ? ".".concat(afterDecimal) : '');
  }
  /**
   * limit decimal numbers to given scale
   * Not used .fixedTo because that will break with big numbers
   */

  function limitToScale(numStr, scale, fixedDecimalScale) {
    let str = '';
    const filler = fixedDecimalScale ? '0' : '';

    for (let i = 0; i <= scale - 1; i++) {
      str += numStr[i] || filler;
    }

    return str;
  }
  /**
   * This method is required to round prop value to given scale.
   * Not used .round or .fixedTo because that will break with big numbers
   */

  function roundToPrecision(numStr, scale, fixedDecimalScale) {
    //if number is empty don't do anything return empty string
    if (['', '-'].indexOf(numStr) !== -1) return numStr;
    const shoudHaveDecimalSeparator = numStr.indexOf('.') !== -1 && scale;

    const _splitDecimal = splitDecimal(numStr),
        beforeDecimal = _splitDecimal.beforeDecimal,
        afterDecimal = _splitDecimal.afterDecimal,
        hasNagation = _splitDecimal.hasNagation;

    const roundedDecimalParts = parseFloat("0.".concat(afterDecimal || '0')).toFixed(scale).split('.');
    const intPart = beforeDecimal.split('').reverse().reduce((roundedStr, current, idx) => {
      if (roundedStr.length > idx) {
        return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
      }

      return current + roundedStr;
    }, roundedDecimalParts[0]);
    const decimalPart = limitToScale(roundedDecimalParts[1] || '', Math.min(scale, afterDecimal.length), fixedDecimalScale);
    const negation = hasNagation ? '-' : '';
    const decimalSeparator = shoudHaveDecimalSeparator ? '.' : '';
    return "".concat(negation).concat(intPart).concat(decimalSeparator).concat(decimalPart);
  }
  function omit(obj, keyMaps) {
    const filteredObj = {};
    Object.keys(obj).forEach((key) => {
      if (!keyMaps[key]) filteredObj[key] = obj[key];
    });
    return filteredObj;
  }
  /** set the caret positon in an input field **/

  function setCaretPosition(el, caretPos) {
    el.value = el.value; // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if (el !== null) {
      if (el.createTextRange) {
        const range = el.createTextRange();
        range.move('character', caretPos);
        range.select();
        return true;
      } // (el.selectionStart === 0 added for Firefox bug)


      if (el.selectionStart || el.selectionStart === 0) {
        el.focus();
        el.setSelectionRange(caretPos, caretPos);
        return true;
      } // fail city, fortunately this never happens (as far as I've tested) :)


      el.focus();
      return false;
    }
  }
  /**
    Given previous value and newValue it returns the index
    start - end to which values have changed.
    This function makes assumption about only consecutive
    characters are changed which is correct assumption for caret input.
  */

  function findChangedIndex(prevValue, newValue) {
    let i = 0,
        j = 0;
    const prevLength = prevValue.length;
    const newLength = newValue.length;

    while (prevValue[i] === newValue[i] && i < prevLength) {
      i++;
    } //check what has been changed from last


    while (prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j] && newLength - j > i && prevLength - j > i) {
      j++;
    }

    return {
      start: i,
      end: prevLength - j
    };
  }
  /*
    Returns a number whose value is limited to the given range
  */

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
  function getCurrentCaretPosition(el) {
    /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
    return Math.max(el.selectionStart, el.selectionEnd);
  }

  const propTypes$1 = {
    thousandSeparator: propTypes.oneOfType([propTypes.string, propTypes.oneOf([true])]),
    decimalSeparator: propTypes.string,
    allowedDecimalSeparators: propTypes.arrayOf(propTypes.string),
    thousandsGroupStyle: propTypes.oneOf(['thousand', 'lakh', 'wan']),
    decimalScale: propTypes.number,
    fixedDecimalScale: propTypes.bool,
    displayType: propTypes.oneOf(['input', 'text']),
    prefix: propTypes.string,
    suffix: propTypes.string,
    format: propTypes.oneOfType([propTypes.string, propTypes.func]),
    removeFormatting: propTypes.func,
    mask: propTypes.oneOfType([propTypes.string, propTypes.arrayOf(propTypes.string)]),
    value: propTypes.oneOfType([propTypes.number, propTypes.string]),
    defaultValue: propTypes.oneOfType([propTypes.number, propTypes.string]),
    isNumericString: propTypes.bool,
    customInput: propTypes.elementType,
    allowNegative: propTypes.bool,
    allowEmptyFormatting: propTypes.bool,
    allowLeadingZeros: propTypes.bool,
    onValueChange: propTypes.func,
    onKeyDown: propTypes.func,
    onMouseUp: propTypes.func,
    onChange: propTypes.func,
    onFocus: propTypes.func,
    onBlur: propTypes.func,
    type: propTypes.oneOf(['text', 'tel', 'password']),
    isAllowed: propTypes.func,
    renderText: propTypes.func,
    getInputRef: propTypes.func
  };
  const defaultProps = {
    displayType: 'input',
    decimalSeparator: '.',
    thousandsGroupStyle: 'thousand',
    fixedDecimalScale: false,
    prefix: '',
    suffix: '',
    allowNegative: true,
    allowEmptyFormatting: false,
    allowLeadingZeros: false,
    isNumericString: false,
    type: 'text',
    onValueChange: noop,
    onChange: noop,
    onKeyDown: noop,
    onMouseUp: noop,
    onFocus: noop,
    onBlur: noop,
    isAllowed: returnTrue
  };

  const NumberFormat =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(NumberFormat, _React$Component);

    function NumberFormat(props) {
      let _this;

      _classCallCheck(this, NumberFormat);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(NumberFormat).call(this, props));
      const defaultValue = props.defaultValue; //validate props

      _this.validateProps();

      const formattedValue = _this.formatValueProp(defaultValue);

      _this.state = {
        value: formattedValue,
        numAsString: _this.removeFormatting(formattedValue)
      };
      _this.selectionBeforeInput = {
        selectionStart: 0,
        selectionEnd: 0
      };
      _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.onKeyDown = _this.onKeyDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.onMouseUp = _this.onMouseUp.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(NumberFormat, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        this.updateValueIfRequired(prevProps);
      }
    }, {
      key: "updateValueIfRequired",
      value: function updateValueIfRequired(prevProps) {
        const props = this.props,
            state = this.state,
            focusedElm = this.focusedElm;
        const stateValue = state.value,
            _state$numAsString = state.numAsString,
            lastNumStr = _state$numAsString === void 0 ? '' : _state$numAsString;

        if (prevProps !== props) {
          //validate props
          this.validateProps();
          const lastValueWithNewFormat = this.formatNumString(lastNumStr);
          const formattedValue = props.value === undefined ? lastValueWithNewFormat : this.formatValueProp();
          const numAsString = this.removeFormatting(formattedValue);
          const floatValue = parseFloat(numAsString);
          const lastFloatValue = parseFloat(lastNumStr);

          if ( //while typing set state only when float value changes
          (!isNaN(floatValue) || !isNaN(lastFloatValue)) && floatValue !== lastFloatValue || //can also set state when float value is same and the format props changes
          lastValueWithNewFormat !== stateValue || //set state always when not in focus and formatted value is changed
          focusedElm === null && formattedValue !== stateValue) {
            this.updateValue({
              formattedValue: formattedValue,
              numAsString: numAsString,
              input: focusedElm
            });
          }
        }
      }
      /** Misc methods **/

    }, {
      key: "getFloatString",
      value: function getFloatString() {
        let num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        const decimalScale = this.props.decimalScale;

        const _this$getSeparators = this.getSeparators(),
            decimalSeparator = _this$getSeparators.decimalSeparator;

        const numRegex = this.getNumberRegex(true); //remove negation for regex check

        const hasNegation = num[0] === '-';
        if (hasNegation) num = num.replace('-', ''); //if decimal scale is zero remove decimal and number after decimalSeparator

        if (decimalSeparator && decimalScale === 0) {
          num = num.split(decimalSeparator)[0];
        }

        num = (num.match(numRegex) || []).join('').replace(decimalSeparator, '.'); //remove extra decimals

        const firstDecimalIndex = num.indexOf('.');

        if (firstDecimalIndex !== -1) {
          num = "".concat(num.substring(0, firstDecimalIndex), ".").concat(num.substring(firstDecimalIndex + 1, num.length).replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), ''));
        } //add negation back


        if (hasNegation) num = '-' + num;
        return num;
      } //returned regex assumes decimalSeparator is as per prop

    }, {
      key: "getNumberRegex",
      value: function getNumberRegex(g, ignoreDecimalSeparator) {
        const _this$props = this.props,
            format = _this$props.format,
            decimalScale = _this$props.decimalScale;

        const _this$getSeparators2 = this.getSeparators(),
            decimalSeparator = _this$getSeparators2.decimalSeparator;

        return new RegExp('\\d' + (decimalSeparator && decimalScale !== 0 && !ignoreDecimalSeparator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
      }
    }, {
      key: "getSeparators",
      value: function getSeparators() {
        const decimalSeparator = this.props.decimalSeparator;
        let _this$props2 = this.props,
            thousandSeparator = _this$props2.thousandSeparator,
            allowedDecimalSeparators = _this$props2.allowedDecimalSeparators;

        if (thousandSeparator === true) {
          thousandSeparator = ',';
        }

        if (!allowedDecimalSeparators) {
          allowedDecimalSeparators = [decimalSeparator, '.'];
        }

        return {
          decimalSeparator: decimalSeparator,
          thousandSeparator: thousandSeparator,
          allowedDecimalSeparators: allowedDecimalSeparators
        };
      }
    }, {
      key: "getMaskAtIndex",
      value: function getMaskAtIndex(index) {
        const _this$props$mask = this.props.mask,
            mask = _this$props$mask === void 0 ? ' ' : _this$props$mask;

        if (typeof mask === 'string') {
          return mask;
        }

        return mask[index] || ' ';
      }
    }, {
      key: "getValueObject",
      value: function getValueObject(formattedValue, numAsString) {
        const floatValue = parseFloat(numAsString);
        return {
          formattedValue: formattedValue,
          value: numAsString,
          floatValue: isNaN(floatValue) ? undefined : floatValue
        };
      }
    }, {
      key: "validateProps",
      value: function validateProps() {
        const mask = this.props.mask; //validate decimalSeparator and thousandSeparator

        const _this$getSeparators3 = this.getSeparators(),
            decimalSeparator = _this$getSeparators3.decimalSeparator,
            thousandSeparator = _this$getSeparators3.thousandSeparator;

        if (decimalSeparator === thousandSeparator) {
          throw new Error("\n          Decimal separator can't be same as thousand separator.\n          thousandSeparator: ".concat(thousandSeparator, " (thousandSeparator = {true} is same as thousandSeparator = \",\")\n          decimalSeparator: ").concat(decimalSeparator, " (default value for decimalSeparator is .)\n       "));
        } //validate mask


        if (mask) {
          const maskAsStr = mask === 'string' ? mask : mask.toString();

          if (maskAsStr.match(/\d/g)) {
            throw new Error("\n          Mask ".concat(mask, " should not contain numeric character;\n        "));
          }
        }
      }
      /** Misc methods end **/

      /** caret specific methods **/

    }, {
      key: "setPatchedCaretPosition",
      value: function setPatchedCaretPosition(el, caretPos, currentValue) {
        /* setting caret position within timeout of 0ms is required for mobile chrome,
        otherwise browser resets the caret position after we set it
        We are also setting it without timeout so that in normal browser we don't see the flickering */
        setCaretPosition(el, caretPos);
        setTimeout(() => {
          if (el.value === currentValue) setCaretPosition(el, caretPos);
        }, 0);
      }
      /* This keeps the caret within typing area so people can't type in between prefix or suffix */

    }, {
      key: "correctCaretPosition",
      value: function correctCaretPosition(value, caretPos, direction) {
        const _this$props3 = this.props,
            prefix = _this$props3.prefix,
            suffix = _this$props3.suffix,
            format = _this$props3.format; //if value is empty return 0

        if (value === '') return 0; //caret position should be between 0 and value length

        caretPos = clamp(caretPos, 0, value.length); //in case of format as number limit between prefix and suffix

        if (!format) {
          const hasNegation = value[0] === '-';
          return clamp(caretPos, prefix.length + (hasNegation ? 1 : 0), value.length - suffix.length);
        } //in case if custom format method don't do anything


        if (typeof format === 'function') return caretPos;
        /* in case format is string find the closest # position from the caret position */
        //in case the caretPos have input value on it don't do anything

        if (format[caretPos] === '#' && charIsNumber(value[caretPos])) return caretPos; //if caretPos is just after input value don't do anything

        if (format[caretPos - 1] === '#' && charIsNumber(value[caretPos - 1])) return caretPos; //find the nearest caret position

        const firstHashPosition = format.indexOf('#');
        const lastHashPosition = format.lastIndexOf('#'); //limit the cursor between the first # position and the last # position

        caretPos = clamp(caretPos, firstHashPosition, lastHashPosition + 1);
        const nextPos = format.substring(caretPos, format.length).indexOf('#');
        let caretLeftBound = caretPos;
        const caretRightBound = caretPos + (nextPos === -1 ? 0 : nextPos); //get the position where the last number is present

        while (caretLeftBound > firstHashPosition && (format[caretLeftBound] !== '#' || !charIsNumber(value[caretLeftBound]))) {
          caretLeftBound -= 1;
        }

        const goToLeft = !charIsNumber(value[caretRightBound]) || direction === 'left' && caretPos !== firstHashPosition || caretPos - caretLeftBound < caretRightBound - caretPos;

        if (goToLeft) {
          //check if number should be taken after the bound or after it
          //if number preceding a valid number keep it after
          return charIsNumber(value[caretLeftBound]) ? caretLeftBound + 1 : caretLeftBound;
        }

        return caretRightBound;
      }
    }, {
      key: "getCaretPosition",
      value: function getCaretPosition(inputValue, formattedValue, caretPos) {
        const format = this.props.format;
        const stateValue = this.state.value;
        const numRegex = this.getNumberRegex(true);
        const inputNumber = (inputValue.match(numRegex) || []).join('');
        const formattedNumber = (formattedValue.match(numRegex) || []).join('');
        let j, i;
        j = 0;

        for (i = 0; i < caretPos; i++) {
          const currentInputChar = inputValue[i] || '';
          const currentFormatChar = formattedValue[j] || ''; //no need to increase new cursor position if formatted value does not have those characters
          //case inputValue = 1a23 and formattedValue =  123

          if (!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue; //When we are striping out leading zeros maintain the new cursor position
          //Case inputValue = 00023 and formattedValue = 23;

          if (currentInputChar === '0' && currentFormatChar.match(numRegex) && currentFormatChar !== '0' && inputNumber.length !== formattedNumber.length) continue; //we are not using currentFormatChar because j can change here

          while (currentInputChar !== formattedValue[j] && j < formattedValue.length) {
            j++;
          }

          j++;
        }

        if (typeof format === 'string' && !stateValue) {
          //set it to the maximum value so it goes after the last number
          j = formattedValue.length;
        } //correct caret position if its outside of editable area


        j = this.correctCaretPosition(formattedValue, j);
        return j;
      }
      /** caret specific methods ends **/

      /** methods to remove formattting **/

    }, {
      key: "removePrefixAndSuffix",
      value: function removePrefixAndSuffix(val) {
        const _this$props4 = this.props,
            format = _this$props4.format,
            prefix = _this$props4.prefix,
            suffix = _this$props4.suffix; //remove prefix and suffix

        if (!format && val) {
          const isNegative = val[0] === '-'; //remove negation sign

          if (isNegative) val = val.substring(1, val.length); //remove prefix

          val = prefix && val.indexOf(prefix) === 0 ? val.substring(prefix.length, val.length) : val; //remove suffix

          const suffixLastIndex = val.lastIndexOf(suffix);
          val = suffix && suffixLastIndex !== -1 && suffixLastIndex === val.length - suffix.length ? val.substring(0, suffixLastIndex) : val; //add negation sign back

          if (isNegative) val = '-' + val;
        }

        return val;
      }
    }, {
      key: "removePatternFormatting",
      value: function removePatternFormatting(val) {
        const format = this.props.format;
        const formatArray = format.split('#').filter((str) => {
          return str !== '';
        });
        let start = 0;
        let numStr = '';

        for (let i = 0, ln = formatArray.length; i <= ln; i++) {
          const part = formatArray[i] || ''; //if i is the last fragment take the index of end of the value
          //For case like +1 (911) 911 91 91 having pattern +1 (###) ### ## ##

          const index = i === ln ? val.length : val.indexOf(part, start);
          /* in any case if we don't find the pattern part in the value assume the val as numeric string
          This will be also in case if user has started typing, in any other case it will not be -1
          unless wrong prop value is provided */

          if (index === -1) {
            numStr = val;
            break;
          } else {
            numStr += val.substring(start, index);
            start = index + part.length;
          }
        }

        return (numStr.match(/\d/g) || []).join('');
      }
    }, {
      key: "removeFormatting",
      value: function removeFormatting(val) {
        const _this$props5 = this.props,
            format = _this$props5.format,
            removeFormatting = _this$props5.removeFormatting;
        if (!val) return val;

        if (!format) {
          val = this.removePrefixAndSuffix(val);
          val = this.getFloatString(val);
        } else if (typeof format === 'string') {
          val = this.removePatternFormatting(val);
        } else if (typeof removeFormatting === 'function') {
          //condition need to be handled if format method is provide,
          val = removeFormatting(val);
        } else {
          val = (val.match(/\d/g) || []).join('');
        }

        return val;
      }
      /** methods to remove formattting end **/

      /*** format specific methods start ***/

      /**
       * Format when # based string is provided
       * @param  {string} numStr Numeric String
       * @return {string}        formatted Value
       */

    }, {
      key: "formatWithPattern",
      value: function formatWithPattern(numStr) {
        const format = this.props.format;
        let hashCount = 0;
        const formattedNumberAry = format.split('');

        for (let i = 0, ln = format.length; i < ln; i++) {
          if (format[i] === '#') {
            formattedNumberAry[i] = numStr[hashCount] || this.getMaskAtIndex(hashCount);
            hashCount += 1;
          }
        }

        return formattedNumberAry.join('');
      }
      /**
       * @param  {string} numStr Numeric string/floatString] It always have decimalSeparator as .
       * @return {string} formatted Value
       */

    }, {
      key: "formatAsNumber",
      value: function formatAsNumber(numStr) {
        const _this$props6 = this.props,
            decimalScale = _this$props6.decimalScale,
            fixedDecimalScale = _this$props6.fixedDecimalScale,
            prefix = _this$props6.prefix,
            suffix = _this$props6.suffix,
            allowNegative = _this$props6.allowNegative,
            thousandsGroupStyle = _this$props6.thousandsGroupStyle;

        const _this$getSeparators4 = this.getSeparators(),
            thousandSeparator = _this$getSeparators4.thousandSeparator,
            decimalSeparator = _this$getSeparators4.decimalSeparator;

        const hasDecimalSeparator = numStr.indexOf('.') !== -1 || decimalScale && fixedDecimalScale;

        let _splitDecimal = splitDecimal(numStr, allowNegative),
            beforeDecimal = _splitDecimal.beforeDecimal,
            afterDecimal = _splitDecimal.afterDecimal,
            addNegation = _splitDecimal.addNegation; // eslint-disable-line prefer-const
        //apply decimal precision if its defined


        if (decimalScale !== undefined) afterDecimal = limitToScale(afterDecimal, decimalScale, fixedDecimalScale);

        if (thousandSeparator) {
          beforeDecimal = applyThousandSeparator(beforeDecimal, thousandSeparator, thousandsGroupStyle);
        } //add prefix and suffix


        if (prefix) beforeDecimal = prefix + beforeDecimal;
        if (suffix) afterDecimal = afterDecimal + suffix; //restore negation sign

        if (addNegation) beforeDecimal = '-' + beforeDecimal;
        numStr = beforeDecimal + (hasDecimalSeparator && decimalSeparator || '') + afterDecimal;
        return numStr;
      }
    }, {
      key: "formatNumString",
      value: function formatNumString() {
        const numStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        const _this$props7 = this.props,
            format = _this$props7.format,
            allowEmptyFormatting = _this$props7.allowEmptyFormatting;
        let formattedValue = numStr;

        if (numStr === '' && !allowEmptyFormatting) {
          formattedValue = '';
        } else if (numStr === '-' && !format) {
          formattedValue = '-';
        } else if (typeof format === 'string') {
          formattedValue = this.formatWithPattern(formattedValue);
        } else if (typeof format === 'function') {
          formattedValue = format(formattedValue);
        } else {
          formattedValue = this.formatAsNumber(formattedValue);
        }

        return formattedValue;
      }
    }, {
      key: "formatValueProp",
      value: function formatValueProp(defaultValue) {
        const _this$props8 = this.props,
            format = _this$props8.format,
            decimalScale = _this$props8.decimalScale,
            fixedDecimalScale = _this$props8.fixedDecimalScale,
            allowEmptyFormatting = _this$props8.allowEmptyFormatting;
        let _this$props9 = this.props,
            _this$props9$value = _this$props9.value,
            value = _this$props9$value === void 0 ? defaultValue : _this$props9$value,
            isNumericString = _this$props9.isNumericString;
        const isNonNumericFalsy = !value && value !== 0;

        if (isNonNumericFalsy && allowEmptyFormatting) {
          value = '';
        } // if value is not defined return empty string


        if (isNonNumericFalsy && !allowEmptyFormatting) return '';

        if (typeof value === 'number') {
          value = value.toString();
          isNumericString = true;
        } //change infinity value to empty string


        if (value === 'Infinity' && isNumericString) {
          value = '';
        } //round the number based on decimalScale
        //format only if non formatted value is provided


        if (isNumericString && !format && typeof decimalScale === 'number') {
          value = roundToPrecision(value, decimalScale, fixedDecimalScale);
        }

        const formattedValue = isNumericString ? this.formatNumString(value) : this.formatInput(value);
        return formattedValue;
      }
    }, {
      key: "formatNegation",
      value: function formatNegation() {
        let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        const allowNegative = this.props.allowNegative;
        const negationRegex = new RegExp('(-)');
        const doubleNegationRegex = new RegExp('(-)(.)*(-)'); // Check number has '-' value

        const hasNegation = negationRegex.test(value); // Check number has 2 or more '-' values

        const removeNegation = doubleNegationRegex.test(value); //remove negation

        value = value.replace(/-/g, '');

        if (hasNegation && !removeNegation && allowNegative) {
          value = '-' + value;
        }

        return value;
      }
    }, {
      key: "formatInput",
      value: function formatInput() {
        let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        const format = this.props.format; //format negation only if we are formatting as number

        if (!format) {
          value = this.removePrefixAndSuffix(value);
          value = this.formatNegation(value);
        } //remove formatting from number


        value = this.removeFormatting(value);
        return this.formatNumString(value);
      }
      /*** format specific methods end ***/

    }, {
      key: "isCharacterAFormat",
      value: function isCharacterAFormat(caretPos, value) {
        const _this$props10 = this.props,
            format = _this$props10.format,
            prefix = _this$props10.prefix,
            suffix = _this$props10.suffix,
            decimalScale = _this$props10.decimalScale,
            fixedDecimalScale = _this$props10.fixedDecimalScale;

        const _this$getSeparators5 = this.getSeparators(),
            decimalSeparator = _this$getSeparators5.decimalSeparator; //check within format pattern


        if (typeof format === 'string' && format[caretPos] !== '#') return true; //check in number format

        if (!format && (caretPos < prefix.length || caretPos >= value.length - suffix.length || decimalScale && fixedDecimalScale && value[caretPos] === decimalSeparator)) {
          return true;
        }

        return false;
      }
    }, {
      key: "checkIfFormatGotDeleted",
      value: function checkIfFormatGotDeleted(start, end, value) {
        for (let i = start; i < end; i++) {
          if (this.isCharacterAFormat(i, value)) return true;
        }

        return false;
      }
      /**
       * This will check if any formatting got removed by the delete or backspace and reset the value
       * It will also work as fallback if android chome keyDown handler does not work
       **/

    }, {
      key: "correctInputValue",
      value: function correctInputValue(caretPos, lastValue, value) {
        const _this$props11 = this.props,
            format = _this$props11.format,
            allowNegative = _this$props11.allowNegative,
            prefix = _this$props11.prefix,
            suffix = _this$props11.suffix;

        const _this$getSeparators6 = this.getSeparators(),
            allowedDecimalSeparators = _this$getSeparators6.allowedDecimalSeparators,
            decimalSeparator = _this$getSeparators6.decimalSeparator;

        const lastNumStr = this.state.numAsString || '';
        const _this$selectionBefore = this.selectionBeforeInput,
            selectionStart = _this$selectionBefore.selectionStart,
            selectionEnd = _this$selectionBefore.selectionEnd;

        const _findChangedIndex = findChangedIndex(lastValue, value),
            start = _findChangedIndex.start,
            end = _findChangedIndex.end;
        /** Check for any allowed decimal separator is added in the numeric format and replace it with decimal separator */


        if (!format && start === end && allowedDecimalSeparators.indexOf(value[selectionStart]) !== -1) {
          return value.substr(0, selectionStart) + decimalSeparator + value.substr(selectionStart + 1, value.length);
        }
        /* don't do anyhting if something got added,
         or if value is empty string (when whole input is cleared)
         or whole input is replace with a number
        */


        const leftBound = !!format ? 0 : prefix.length;
        const rightBound = lastValue.length - (!!format ? 0 : suffix.length);

        if (value.length > lastValue.length || !value.length || start === end || selectionStart === 0 && selectionEnd === lastValue.length || selectionStart === leftBound && selectionEnd === rightBound) {
          return value;
        } //if format got deleted reset the value to last value


        if (this.checkIfFormatGotDeleted(start, end, lastValue)) {
          value = lastValue;
        } //for numbers check if beforeDecimal got deleted and there is nothing after decimal,
        //clear all numbers in such case while keeping the - sign


        if (!format) {
          const numericString = this.removeFormatting(value);

          let _splitDecimal2 = splitDecimal(numericString, allowNegative),
              beforeDecimal = _splitDecimal2.beforeDecimal,
              afterDecimal = _splitDecimal2.afterDecimal,
              addNegation = _splitDecimal2.addNegation; // eslint-disable-line prefer-const
          //clear only if something got deleted


          const isBeforeDecimalPoint = caretPos < value.indexOf(decimalSeparator) + 1;

          if (numericString.length < lastNumStr.length && isBeforeDecimalPoint && beforeDecimal === '' && !parseFloat(afterDecimal)) {
            return addNegation ? '-' : '';
          }
        }

        return value;
      }
      /** Update value and caret position */

    }, {
      key: "updateValue",
      value: function updateValue(params) {
        const _this2 = this;

        const onUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
        const formattedValue = params.formattedValue,
            input = params.input;
        let numAsString = params.numAsString,
            caretPos = params.caretPos;
        const onValueChange = this.props.onValueChange;
        const lastValue = this.state.value; //set caret position, and value imperatively when element is provided

        if (input) {
          //calculate caret position if not defined
          if (!caretPos) {
            const inputValue = params.inputValue || input.value;
            const currentCaretPosition = getCurrentCaretPosition(input); //get the caret position

            caretPos = this.getCaretPosition(inputValue, formattedValue, currentCaretPosition);
          } //set the value imperatively, this is required for IE fix


          input.value = formattedValue; //set caret position

          this.setPatchedCaretPosition(input, caretPos, formattedValue);
        } //calculate numeric string if not passed


        if (numAsString === undefined) {
          numAsString = this.removeFormatting(formattedValue);
        } //update state if value is changed


        if (formattedValue !== lastValue) {
          this.setState({
            value: formattedValue,
            numAsString: numAsString
          }, () => {
            onValueChange(_this2.getValueObject(formattedValue, numAsString));
            onUpdate();
          });
        } else {
          onUpdate();
        }
      }
    }, {
      key: "onChange",
      value: function onChange(e) {
        e.persist();
        const el = e.target;
        let inputValue = el.value;
        const state = this.state,
            props = this.props;
        const isAllowed = props.isAllowed;
        const lastValue = state.value || '';
        const currentCaretPosition = getCurrentCaretPosition(el);
        inputValue = this.correctInputValue(currentCaretPosition, lastValue, inputValue);
        let formattedValue = this.formatInput(inputValue) || '';
        const numAsString = this.removeFormatting(formattedValue);
        const valueObj = this.getValueObject(formattedValue, numAsString);

        if (!isAllowed(valueObj)) {
          formattedValue = lastValue;
        }

        this.updateValue({
          formattedValue: formattedValue,
          numAsString: numAsString,
          inputValue: inputValue,
          input: el
        }, () => {
          props.onChange(e);
        });
      }
    }, {
      key: "onBlur",
      value: function onBlur(e) {
        const props = this.props,
            state = this.state;
        const format = props.format,
            onBlur = props.onBlur,
            allowLeadingZeros = props.allowLeadingZeros;
        let numAsString = state.numAsString;
        const lastValue = state.value;
        this.focusedElm = null;

        if (this.focusTimeout) {
          clearTimeout(this.focusTimeout);
        }

        if (!format) {
          if (!allowLeadingZeros) {
            numAsString = fixLeadingZero(numAsString);
          }

          const formattedValue = this.formatNumString(numAsString); //change the state

          if (formattedValue !== lastValue) {
            // the event needs to be persisted because its properties can be accessed in an asynchronous way
            e.persist();
            this.updateValue({
              formattedValue: formattedValue,
              numAsString: numAsString
            }, () => {
              onBlur(e);
            });
            return;
          }
        }

        onBlur(e);
      }
    }, {
      key: "onKeyDown",
      value: function onKeyDown(e) {
        const el = e.target;
        const key = e.key;
        const selectionStart = el.selectionStart,
            selectionEnd = el.selectionEnd,
            _el$value = el.value,
            value = _el$value === void 0 ? '' : _el$value;
        let expectedCaretPosition;
        const _this$props12 = this.props,
            decimalScale = _this$props12.decimalScale,
            fixedDecimalScale = _this$props12.fixedDecimalScale,
            prefix = _this$props12.prefix,
            suffix = _this$props12.suffix,
            format = _this$props12.format,
            onKeyDown = _this$props12.onKeyDown,
            onValueChange = _this$props12.onValueChange;
        const ignoreDecimalSeparator = decimalScale !== undefined && fixedDecimalScale;
        const numRegex = this.getNumberRegex(false, ignoreDecimalSeparator);
        const negativeRegex = new RegExp('-');
        const isPatternFormat = typeof format === 'string';
        this.selectionBeforeInput = {
          selectionStart: selectionStart,
          selectionEnd: selectionEnd //Handle backspace and delete against non numerical/decimal characters or arrow keys

        };

        if (key === 'ArrowLeft' || key === 'Backspace') {
          expectedCaretPosition = selectionStart - 1;
        } else if (key === 'ArrowRight') {
          expectedCaretPosition = selectionStart + 1;
        } else if (key === 'Delete') {
          expectedCaretPosition = selectionStart;
        } //if expectedCaretPosition is not set it means we don't want to Handle keyDown
        //also if multiple characters are selected don't handle


        if (expectedCaretPosition === undefined || selectionStart !== selectionEnd) {
          onKeyDown(e);
          return;
        }

        let newCaretPosition = expectedCaretPosition;
        const leftBound = isPatternFormat ? format.indexOf('#') : prefix.length;
        const rightBound = isPatternFormat ? format.lastIndexOf('#') + 1 : value.length - suffix.length;

        if (key === 'ArrowLeft' || key === 'ArrowRight') {
          const direction = key === 'ArrowLeft' ? 'left' : 'right';
          newCaretPosition = this.correctCaretPosition(value, expectedCaretPosition, direction);
        } else if (key === 'Delete' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
          while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < rightBound) {
            newCaretPosition++;
          }
        } else if (key === 'Backspace' && !numRegex.test(value[expectedCaretPosition])) {
          /* NOTE: This is special case when backspace is pressed on a
          negative value while the cursor position is after prefix. We can't handle it on onChange because
          we will not have any information of keyPress
          */
          if (selectionStart <= leftBound + 1 && value[0] === '-' && typeof format === 'undefined') {
            const newValue = value.substring(1); //persist event before performing async task

            e.persist();
            this.updateValue({
              formattedValue: newValue,
              caretPos: newCaretPosition,
              input: el
            });
          } else if (!negativeRegex.test(value[expectedCaretPosition])) {
            while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > leftBound) {
              newCaretPosition--;
            }

            newCaretPosition = this.correctCaretPosition(value, newCaretPosition, 'left');
          }
        }

        if (newCaretPosition !== expectedCaretPosition || expectedCaretPosition < leftBound || expectedCaretPosition > rightBound) {
          e.preventDefault();
          this.setPatchedCaretPosition(el, newCaretPosition, value);
        }
        /* NOTE: this is just required for unit test as we need to get the newCaretPosition,
                Remove this when you find different solution */


        if (e.isUnitTestRun) {
          this.setPatchedCaretPosition(el, newCaretPosition, value);
        }

        this.props.onKeyDown(e);
      }
      /** required to handle the caret position when click anywhere within the input **/

    }, {
      key: "onMouseUp",
      value: function onMouseUp(e) {
        const el = e.target;
        /**
         * NOTE: we have to give default value for value as in case when custom input is provided
         * value can come as undefined when nothing is provided on value prop.
        */

        const selectionStart = el.selectionStart,
            selectionEnd = el.selectionEnd,
            _el$value2 = el.value,
            value = _el$value2 === void 0 ? '' : _el$value2;

        if (selectionStart === selectionEnd) {
          const caretPosition = this.correctCaretPosition(value, selectionStart);

          if (caretPosition !== selectionStart) {
            this.setPatchedCaretPosition(el, caretPosition, value);
          }
        }

        this.props.onMouseUp(e);
      }
    }, {
      key: "onFocus",
      value: function onFocus(e) {
        const _this3 = this;

        // Workaround Chrome and Safari bug https://bugs.chromium.org/p/chromium/issues/detail?id=779328
        // (onFocus event target selectionStart is always 0 before setTimeout)
        e.persist();
        this.focusedElm = e.target;
        this.focusTimeout = setTimeout(() => {
          const el = e.target;
          const selectionStart = el.selectionStart,
              selectionEnd = el.selectionEnd,
              _el$value3 = el.value,
              value = _el$value3 === void 0 ? '' : _el$value3;

          const caretPosition = _this3.correctCaretPosition(value, selectionStart); //setPatchedCaretPosition only when everything is not selected on focus (while tabbing into the field)


          if (caretPosition !== selectionStart && !(selectionStart === 0 && selectionEnd === value.length)) {
            _this3.setPatchedCaretPosition(el, caretPosition, value);
          }

          _this3.props.onFocus(e);
        }, 0);
      }
    }, {
      key: "render",
      value: function render() {
        const _this$props13 = this.props,
            type = _this$props13.type,
            displayType = _this$props13.displayType,
            customInput = _this$props13.customInput,
            renderText = _this$props13.renderText,
            getInputRef = _this$props13.getInputRef;
        const value = this.state.value;
        const otherProps = omit(this.props, propTypes$1);

        const inputProps = _extends({}, otherProps, {
          type: type,
          value: value,
          onChange: this.onChange,
          onKeyDown: this.onKeyDown,
          onMouseUp: this.onMouseUp,
          onFocus: this.onFocus,
          onBlur: this.onBlur
        });

        if (displayType === 'text') {
          return renderText ? renderText(value) || null : React.createElement("span", _extends({}, otherProps, {
            ref: getInputRef
          }), value);
        } else if (customInput) {
          const CustomInput = customInput;
          return React.createElement(CustomInput, _extends({}, inputProps, {
            ref: getInputRef
          }));
        }

        return React.createElement("input", _extends({}, inputProps, {
          ref: getInputRef
        }));
      }
    }]);

    return NumberFormat;
  }(React.Component);

  NumberFormat.propTypes = propTypes$1;
  NumberFormat.defaultProps = defaultProps;

  return NumberFormat;

}));
