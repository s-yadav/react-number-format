/*!
 * react-number-format - 3.1.5
 * Author : Sudhanshu Yadav
 * Copyright (c) 2016,2018 to Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["NumberFormat"] = factory(require("react"));
	else
		root["NumberFormat"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _utils = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var propTypes = {
	  thousandSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf([true])]),
	  decimalSeparator: _propTypes2.default.string,
	  decimalScale: _propTypes2.default.number,
	  fixedDecimalScale: _propTypes2.default.bool,
	  displayType: _propTypes2.default.oneOf(['input', 'text']),
	  prefix: _propTypes2.default.string,
	  suffix: _propTypes2.default.string,
	  format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	  removeFormatting: _propTypes2.default.func,
	  mask: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
	  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	  isNumericString: _propTypes2.default.bool,
	  customInput: _propTypes2.default.func,
	  allowNegative: _propTypes2.default.bool,
	  onValueChange: _propTypes2.default.func,
	  onKeyDown: _propTypes2.default.func,
	  onMouseUp: _propTypes2.default.func,
	  onChange: _propTypes2.default.func,
	  onFocus: _propTypes2.default.func,
	  onBlur: _propTypes2.default.func,
	  type: _propTypes2.default.oneOf(['text', 'tel']),
	  isAllowed: _propTypes2.default.func,
	  renderText: _propTypes2.default.func,
	  getInputRef: _propTypes2.default.func
	};

	var defaultProps = {
	  displayType: 'input',
	  decimalSeparator: '.',
	  fixedDecimalScale: false,
	  prefix: '',
	  suffix: '',
	  allowNegative: true,
	  isNumericString: false,
	  type: 'text',
	  onValueChange: _utils.noop,
	  onChange: _utils.noop,
	  onKeyDown: _utils.noop,
	  onMouseUp: _utils.noop,
	  onFocus: _utils.noop,
	  onBlur: _utils.noop,
	  isAllowed: _utils.returnTrue,
	  getInputRef: _utils.noop
	};

	var NumberFormat = function (_React$Component) {
	  _inherits(NumberFormat, _React$Component);

	  function NumberFormat(props) {
	    _classCallCheck(this, NumberFormat);

	    //validate props
	    var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

	    _this.validateProps();

	    var formattedValue = _this.formatValueProp();

	    _this.state = {
	      value: formattedValue,
	      numAsString: _this.removeFormatting(formattedValue)
	    };

	    _this.selectionBeforeInput = {
	      selectionStart: 0,
	      selectionEnd: 0
	    };

	    _this.onChange = _this.onChange.bind(_this);
	    _this.onKeyDown = _this.onKeyDown.bind(_this);
	    _this.onMouseUp = _this.onMouseUp.bind(_this);
	    _this.onFocus = _this.onFocus.bind(_this);
	    _this.onBlur = _this.onBlur.bind(_this);
	    return _this;
	  }

	  _createClass(NumberFormat, [{
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      this.updateValueIfRequired(prevProps);
	    }
	  }, {
	    key: 'updateValueIfRequired',
	    value: function updateValueIfRequired(prevProps) {
	      var props = this.props,
	          state = this.state;


	      if (prevProps !== props) {
	        //validate props
	        this.validateProps();

	        var stateValue = state.value;

	        var lastNumStr = state.numAsString || '';

	        var formattedValue = props.value === undefined ? this.formatNumString(lastNumStr) : this.formatValueProp();

	        if (formattedValue !== stateValue) {
	          this.setState({
	            value: formattedValue,
	            numAsString: this.removeFormatting(formattedValue)
	          });
	        }
	      }
	    }

	    /** Misc methods **/

	  }, {
	    key: 'getFloatString',
	    value: function getFloatString() {
	      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	      var _getSeparators = this.getSeparators(),
	          decimalSeparator = _getSeparators.decimalSeparator;

	      var numRegex = this.getNumberRegex(true);

	      //remove negation for regex check
	      var hasNegation = num[0] === '-';
	      if (hasNegation) num = num.replace('-', '');

	      num = (num.match(numRegex) || []).join('').replace(decimalSeparator, '.');

	      //remove extra decimals
	      var firstDecimalIndex = num.indexOf('.');

	      if (firstDecimalIndex !== -1) {
	        num = num.substring(0, firstDecimalIndex) + '.' + num.substring(firstDecimalIndex + 1, num.length).replace(new RegExp((0, _utils.escapeRegExp)(decimalSeparator), 'g'), '');
	      }

	      //add negation back
	      if (hasNegation) num = '-' + num;

	      return num;
	    }

	    //returned regex assumes decimalSeparator is as per prop

	  }, {
	    key: 'getNumberRegex',
	    value: function getNumberRegex(g, ignoreDecimalSeparator) {
	      var _props = this.props,
	          format = _props.format,
	          decimalScale = _props.decimalScale;

	      var _getSeparators2 = this.getSeparators(),
	          decimalSeparator = _getSeparators2.decimalSeparator;

	      return new RegExp('\\d' + (decimalSeparator && decimalScale !== 0 && !ignoreDecimalSeparator && !format ? '|' + (0, _utils.escapeRegExp)(decimalSeparator) : ''), g ? 'g' : undefined);
	    }
	  }, {
	    key: 'getSeparators',
	    value: function getSeparators() {
	      var decimalSeparator = this.props.decimalSeparator;
	      var thousandSeparator = this.props.thousandSeparator;


	      if (thousandSeparator === true) {
	        thousandSeparator = ',';
	      }

	      return {
	        decimalSeparator: decimalSeparator,
	        thousandSeparator: thousandSeparator
	      };
	    }
	  }, {
	    key: 'getMaskAtIndex',
	    value: function getMaskAtIndex(index) {
	      var _props$mask = this.props.mask,
	          mask = _props$mask === undefined ? ' ' : _props$mask;

	      if (typeof mask === 'string') {
	        return mask;
	      }

	      return mask[index] || ' ';
	    }
	  }, {
	    key: 'validateProps',
	    value: function validateProps() {
	      var mask = this.props.mask;

	      //validate decimalSeparator and thousandSeparator

	      var _getSeparators3 = this.getSeparators(),
	          decimalSeparator = _getSeparators3.decimalSeparator,
	          thousandSeparator = _getSeparators3.thousandSeparator;

	      if (decimalSeparator === thousandSeparator) {
	        throw new Error('\n          Decimal separator can\'t be same as thousand separator.\n\n          thousandSeparator: ' + thousandSeparator + ' (thousandSeparator = {true} is same as thousandSeparator = ",")\n          decimalSeparator: ' + decimalSeparator + ' (default value for decimalSeparator is .)\n       ');
	      }

	      //validate mask
	      if (mask) {
	        var maskAsStr = mask === 'string' ? mask : mask.toString();
	        if (maskAsStr.match(/\d/g)) {
	          throw new Error('\n          Mask ' + mask + ' should not contain numeric character;\n        ');
	        }
	      }
	    }
	    /** Misc methods end **/

	    /** caret specific methods **/

	  }, {
	    key: 'setPatchedCaretPosition',
	    value: function setPatchedCaretPosition(el, caretPos, currentValue) {
	      /* setting caret position within timeout of 0ms is required for mobile chrome,
	      otherwise browser resets the caret position after we set it
	      We are also setting it without timeout so that in normal browser we don't see the flickering */
	      (0, _utils.setCaretPosition)(el, caretPos);
	      setTimeout(function () {
	        if (el.value === currentValue) (0, _utils.setCaretPosition)(el, caretPos);
	      }, 0);
	    }

	    /* This keeps the caret within typing area so people can't type in between prefix or suffix */

	  }, {
	    key: 'correctCaretPosition',
	    value: function correctCaretPosition(value, caretPos, direction) {
	      var _props2 = this.props,
	          prefix = _props2.prefix,
	          suffix = _props2.suffix,
	          format = _props2.format;

	      //in case of format as number limit between prefix and suffix

	      if (!format) {
	        var hasNegation = value[0] === '-';
	        return Math.min(Math.max(caretPos, prefix.length + (hasNegation ? 1 : 0)), value.length - suffix.length);
	      }

	      //in case if custom format method don't do anything
	      if (typeof format === 'function') return caretPos;

	      /* in case format is string find the closest # position from the caret position */

	      //in case the caretPos have input value on it don't do anything
	      if (format[caretPos] === '#' && (0, _utils.charIsNumber)(value[caretPos])) return caretPos;

	      //if caretPos is just after input value don't do anything
	      if (format[caretPos - 1] === '#' && (0, _utils.charIsNumber)(value[caretPos - 1])) return caretPos;

	      //find the nearest caret position
	      var firstHashPosition = format.indexOf('#');
	      var lastHashPosition = format.lastIndexOf('#');

	      //limit the cursor between the first # position and the last # position
	      caretPos = Math.min(Math.max(caretPos, firstHashPosition), lastHashPosition + 1);

	      var nextPos = format.substring(caretPos, format.length).indexOf('#');
	      var caretLeftBound = caretPos;
	      var caretRightBoud = caretPos + (nextPos === -1 ? 0 : nextPos);

	      //get the position where the last number is present
	      while (caretLeftBound > firstHashPosition && (format[caretLeftBound] !== '#' || !(0, _utils.charIsNumber)(value[caretLeftBound]))) {
	        caretLeftBound -= 1;
	      }

	      var goToLeft = !(0, _utils.charIsNumber)(value[caretRightBoud]) || direction === 'left' && caretPos !== firstHashPosition || caretPos - caretLeftBound < caretRightBoud - caretPos;

	      return goToLeft ? caretLeftBound + 1 : caretRightBoud;
	    }
	  }, {
	    key: 'getCaretPosition',
	    value: function getCaretPosition(inputValue, formattedValue, caretPos) {
	      var format = this.props.format;

	      var stateValue = this.state.value;
	      var numRegex = this.getNumberRegex(true);
	      var inputNumber = (inputValue.match(numRegex) || []).join('');
	      var formattedNumber = (formattedValue.match(numRegex) || []).join('');
	      var j = void 0,
	          i = void 0;

	      j = 0;

	      for (i = 0; i < caretPos; i++) {
	        var currentInputChar = inputValue[i] || '';
	        var currentFormatChar = formattedValue[j] || '';
	        //no need to increase new cursor position if formatted value does not have those characters
	        //case inputValue = 1a23 and formattedValue =  123
	        if (!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue;

	        //When we are striping out leading zeros maintain the new cursor position
	        //Case inputValue = 00023 and formattedValue = 23;
	        if (currentInputChar === '0' && currentFormatChar.match(numRegex) && currentFormatChar !== '0' && inputNumber.length !== formattedNumber.length) continue;

	        //we are not using currentFormatChar because j can change here
	        while (currentInputChar !== formattedValue[j] && j < formattedValue.length) {
	          j++;
	        }j++;
	      }

	      if (typeof format === 'string' && !stateValue) {
	        //set it to the maximum value so it goes after the last number
	        j = formattedValue.length;
	      }

	      //correct caret position if its outside of editable area
	      j = this.correctCaretPosition(formattedValue, j);

	      return j;
	    }
	    /** caret specific methods ends **/

	    /** methods to remove formattting **/

	  }, {
	    key: 'removePrefixAndSuffix',
	    value: function removePrefixAndSuffix(val) {
	      var _props3 = this.props,
	          format = _props3.format,
	          prefix = _props3.prefix,
	          suffix = _props3.suffix;

	      //remove prefix and suffix

	      if (!format && val) {
	        var isNegative = val[0] === '-';

	        //remove negation sign
	        if (isNegative) val = val.substring(1, val.length);

	        //remove prefix
	        val = prefix && val.indexOf(prefix) === 0 ? val.substring(prefix.length, val.length) : val;

	        //remove suffix
	        var suffixLastIndex = val.lastIndexOf(suffix);
	        val = suffix && suffixLastIndex !== -1 && suffixLastIndex === val.length - suffix.length ? val.substring(0, suffixLastIndex) : val;

	        //add negation sign back
	        if (isNegative) val = '-' + val;
	      }

	      return val;
	    }
	  }, {
	    key: 'removePatternFormatting',
	    value: function removePatternFormatting(val) {
	      var format = this.props.format;

	      var formatArray = format.split('#').filter(function (str) {
	        return str !== '';
	      });
	      var start = 0;
	      var numStr = '';

	      for (var i = 0, ln = formatArray.length; i <= ln; i++) {
	        var part = formatArray[i] || '';

	        //if i is the last fragment take the index of end of the value
	        //For case like +1 (911) 911 91 91 having pattern +1 (###) ### ## ##
	        var index = i === ln ? val.length : val.indexOf(part, start);

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
	    key: 'removeFormatting',
	    value: function removeFormatting(val) {
	      var _props4 = this.props,
	          format = _props4.format,
	          removeFormatting = _props4.removeFormatting;

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
	    key: 'formatWithPattern',
	    value: function formatWithPattern(numStr) {
	      var format = this.props.format;

	      var hashCount = 0;
	      var formattedNumberAry = format.split('');
	      for (var i = 0, ln = format.length; i < ln; i++) {
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
	    key: 'formatAsNumber',
	    value: function formatAsNumber(numStr) {
	      var _props5 = this.props,
	          decimalScale = _props5.decimalScale,
	          fixedDecimalScale = _props5.fixedDecimalScale,
	          prefix = _props5.prefix,
	          suffix = _props5.suffix,
	          allowNegative = _props5.allowNegative;

	      var _getSeparators4 = this.getSeparators(),
	          thousandSeparator = _getSeparators4.thousandSeparator,
	          decimalSeparator = _getSeparators4.decimalSeparator;

	      var hasDecimalSeparator = numStr.indexOf('.') !== -1 || decimalScale && fixedDecimalScale;

	      var _splitDecimal = (0, _utils.splitDecimal)(numStr, allowNegative),
	          beforeDecimal = _splitDecimal.beforeDecimal,
	          afterDecimal = _splitDecimal.afterDecimal,
	          addNegation = _splitDecimal.addNegation; // eslint-disable-line prefer-const

	      //apply decimal precision if its defined


	      if (decimalScale !== undefined) afterDecimal = (0, _utils.limitToScale)(afterDecimal, decimalScale, fixedDecimalScale);

	      if (thousandSeparator) {
	        beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
	      }

	      //add prefix and suffix
	      if (prefix) beforeDecimal = prefix + beforeDecimal;
	      if (suffix) afterDecimal = afterDecimal + suffix;

	      //restore negation sign
	      if (addNegation) beforeDecimal = '-' + beforeDecimal;

	      numStr = beforeDecimal + (hasDecimalSeparator && decimalSeparator || '') + afterDecimal;

	      return numStr;
	    }
	  }, {
	    key: 'formatNumString',
	    value: function formatNumString() {
	      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	      var format = this.props.format;

	      var formattedValue = value;

	      if (value === '') {
	        formattedValue = '';
	      } else if (value === '-' && !format) {
	        formattedValue = '-';
	        value = '';
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
	    key: 'formatValueProp',
	    value: function formatValueProp() {
	      var _props6 = this.props,
	          format = _props6.format,
	          decimalScale = _props6.decimalScale,
	          fixedDecimalScale = _props6.fixedDecimalScale;
	      var _props7 = this.props,
	          value = _props7.value,
	          isNumericString = _props7.isNumericString;

	      // if value is not defined return empty string

	      if (value === undefined) return '';

	      if (typeof value === 'number') {
	        value = value.toString();
	        isNumericString = true;
	      }

	      //round the number based on decimalScale
	      //format only if non formatted value is provided
	      if (isNumericString && !format && typeof decimalScale === 'number') {
	        value = (0, _utils.roundToPrecision)(value, decimalScale, fixedDecimalScale);
	      }

	      var formattedValue = isNumericString ? this.formatNumString(value) : this.formatInput(value);

	      return formattedValue;
	    }
	  }, {
	    key: 'formatNegation',
	    value: function formatNegation() {
	      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	      var allowNegative = this.props.allowNegative;

	      var negationRegex = new RegExp('(-)');
	      var doubleNegationRegex = new RegExp('(-)(.)*(-)');

	      // Check number has '-' value
	      var hasNegation = negationRegex.test(value);

	      // Check number has 2 or more '-' values
	      var removeNegation = doubleNegationRegex.test(value);

	      //remove negation
	      value = value.replace(/-/g, '');

	      if (hasNegation && !removeNegation && allowNegative) {
	        value = '-' + value;
	      }

	      return value;
	    }
	  }, {
	    key: 'formatInput',
	    value: function formatInput() {
	      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	      var format = this.props.format;

	      //format negation only if we are formatting as number

	      if (!format) {
	        value = this.formatNegation(value);
	      }

	      //remove formatting from number
	      value = this.removeFormatting(value);

	      return this.formatNumString(value);
	    }

	    /*** format specific methods end ***/

	  }, {
	    key: 'isCharacterAFormat',
	    value: function isCharacterAFormat(caretPos, value) {
	      var _props8 = this.props,
	          format = _props8.format,
	          prefix = _props8.prefix,
	          suffix = _props8.suffix,
	          decimalScale = _props8.decimalScale,
	          fixedDecimalScale = _props8.fixedDecimalScale;

	      var _getSeparators5 = this.getSeparators(),
	          decimalSeparator = _getSeparators5.decimalSeparator;

	      //check within format pattern


	      if (typeof format === 'string' && format[caretPos] !== '#') return true;

	      //check in number format
	      if (!format && (caretPos < prefix.length || caretPos >= value.length - suffix.length || decimalScale && fixedDecimalScale && value[caretPos] === decimalSeparator)) {
	        return true;
	      }

	      return false;
	    }
	  }, {
	    key: 'checkIfFormatGotDeleted',
	    value: function checkIfFormatGotDeleted(start, end, value) {
	      for (var i = start; i < end; i++) {
	        if (this.isCharacterAFormat(i, value)) return true;
	      }
	      return false;
	    }

	    /**
	     * This will check if any formatting got removed by the delete or backspace and reset the value
	     * It will also work as fallback if android chome keyDown handler does not work
	     **/

	  }, {
	    key: 'correctInputValue',
	    value: function correctInputValue(caretPos, lastValue, value) {
	      var _props9 = this.props,
	          format = _props9.format,
	          decimalSeparator = _props9.decimalSeparator,
	          allowNegative = _props9.allowNegative;

	      var lastNumStr = this.state.numAsString || '';
	      var _selectionBeforeInput = this.selectionBeforeInput,
	          selectionStart = _selectionBeforeInput.selectionStart,
	          selectionEnd = _selectionBeforeInput.selectionEnd;

	      var _findChangedIndex = (0, _utils.findChangedIndex)(lastValue, value),
	          start = _findChangedIndex.start,
	          end = _findChangedIndex.end;

	      /* don't do anyhting if something got added,
	       or if value is empty string (when whole input is cleared)
	       or whole input is replace with a number
	      */


	      if (value.length > lastValue.length || !value.length || start === end || start === 0 && end === lastValue.length || selectionStart === 0 && selectionEnd === lastValue.length) {
	        return value;
	      }

	      //if format got deleted reset the value to last value
	      if (this.checkIfFormatGotDeleted(start, end, lastValue)) {
	        value = lastValue;
	      }

	      //for numbers check if beforeDecimal got deleted and there is nothing after decimal,
	      //clear all numbers in such case while keeping the - sign
	      if (!format) {
	        var numericString = this.removeFormatting(value);

	        var _splitDecimal2 = (0, _utils.splitDecimal)(numericString, allowNegative),
	            beforeDecimal = _splitDecimal2.beforeDecimal,
	            afterDecimal = _splitDecimal2.afterDecimal,
	            addNegation = _splitDecimal2.addNegation; // eslint-disable-line prefer-const

	        //clear only if something got deleted


	        var isBeforeDecimalPoint = caretPos < value.indexOf(decimalSeparator) + 1;
	        if (numericString.length < lastNumStr.length && isBeforeDecimalPoint && beforeDecimal === '' && !parseFloat(afterDecimal)) {
	          return addNegation ? '-' : '';
	        }
	      }

	      return value;
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(e) {
	      e.persist();
	      var el = e.target;
	      var inputValue = el.value;
	      var state = this.state,
	          props = this.props;
	      var isAllowed = props.isAllowed;

	      var lastValue = state.value || '';

	      /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
	      var currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

	      inputValue = this.correctInputValue(currentCaretPosition, lastValue, inputValue);

	      var formattedValue = this.formatInput(inputValue) || '';
	      var numAsString = this.removeFormatting(formattedValue);

	      var valueObj = {
	        formattedValue: formattedValue,
	        value: numAsString,
	        floatValue: parseFloat(numAsString)
	      };

	      if (!isAllowed(valueObj)) {
	        formattedValue = lastValue;
	      }

	      //set the value imperatively, this is required for IE fix
	      el.value = formattedValue;

	      //get the caret position
	      var caretPos = this.getCaretPosition(inputValue, formattedValue, currentCaretPosition);

	      //set caret position
	      this.setPatchedCaretPosition(el, caretPos, formattedValue);

	      //change the state
	      if (formattedValue !== lastValue) {
	        this.setState({ value: formattedValue, numAsString: numAsString }, function () {
	          props.onValueChange(valueObj);
	          props.onChange(e);
	        });
	      } else {
	        props.onChange(e);
	      }
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(e) {
	      var props = this.props,
	          state = this.state;
	      var format = props.format,
	          onBlur = props.onBlur;
	      var numAsString = state.numAsString;

	      var lastValue = state.value;
	      if (!format) {
	        numAsString = (0, _utils.fixLeadingZero)(numAsString);
	        var formattedValue = this.formatNumString(numAsString);
	        var valueObj = {
	          formattedValue: formattedValue,
	          value: numAsString,
	          floatValue: parseFloat(numAsString)
	        };

	        //change the state
	        if (formattedValue !== lastValue) {
	          // the event needs to be persisted because its properties can be accessed in an asynchronous way
	          e.persist();
	          this.setState({ value: formattedValue, numAsString: numAsString }, function () {
	            props.onValueChange(valueObj);
	            onBlur(e);
	          });
	          return;
	        }
	      }
	      onBlur(e);
	    }
	  }, {
	    key: 'onKeyDown',
	    value: function onKeyDown(e) {
	      var el = e.target;
	      var key = e.key;
	      var selectionStart = el.selectionStart,
	          selectionEnd = el.selectionEnd,
	          value = el.value;

	      var expectedCaretPosition = void 0;
	      var _props10 = this.props,
	          decimalScale = _props10.decimalScale,
	          fixedDecimalScale = _props10.fixedDecimalScale,
	          prefix = _props10.prefix,
	          suffix = _props10.suffix,
	          format = _props10.format,
	          onKeyDown = _props10.onKeyDown;

	      var ignoreDecimalSeparator = decimalScale !== undefined && fixedDecimalScale;
	      var numRegex = this.getNumberRegex(false, ignoreDecimalSeparator);
	      var negativeRegex = new RegExp('-');
	      var isPatternFormat = typeof format === 'string';

	      this.selectionBeforeInput = {
	        selectionStart: selectionStart,
	        selectionEnd: selectionEnd

	        //Handle backspace and delete against non numerical/decimal characters or arrow keys
	      };if (key === 'ArrowLeft' || key === 'Backspace') {
	        expectedCaretPosition = selectionStart - 1;
	      } else if (key === 'ArrowRight') {
	        expectedCaretPosition = selectionStart + 1;
	      } else if (key === 'Delete') {
	        expectedCaretPosition = selectionStart;
	      }

	      //if expectedCaretPosition is not set it means we don't want to Handle keyDown
	      //also if multiple characters are selected don't handle
	      if (expectedCaretPosition === undefined || selectionStart !== selectionEnd) {
	        onKeyDown(e);
	        return;
	      }

	      var newCaretPosition = expectedCaretPosition;
	      var leftBound = isPatternFormat ? format.indexOf('#') : prefix.length;
	      var rightBound = isPatternFormat ? format.lastIndexOf('#') + 1 : value.length - suffix.length;

	      if (key === 'ArrowLeft' || key === 'ArrowRight') {
	        var direction = key === 'ArrowLeft' ? 'left' : 'right';
	        newCaretPosition = this.correctCaretPosition(value, expectedCaretPosition, direction);
	      } else if (key === 'Delete' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
	        while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < rightBound) {
	          newCaretPosition++;
	        }
	      } else if (key === 'Backspace' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
	        while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > leftBound) {
	          newCaretPosition--;
	        }
	        newCaretPosition = this.correctCaretPosition(value, newCaretPosition, 'left');
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
	    key: 'onMouseUp',
	    value: function onMouseUp(e) {
	      var el = e.target;
	      var selectionStart = el.selectionStart,
	          selectionEnd = el.selectionEnd,
	          value = el.value;


	      if (selectionStart === selectionEnd) {
	        var caretPostion = this.correctCaretPosition(value, selectionStart);
	        if (caretPostion !== selectionStart) {
	          this.setPatchedCaretPosition(el, caretPostion, value);
	        }
	      }

	      this.props.onMouseUp(e);
	    }
	  }, {
	    key: 'onFocus',
	    value: function onFocus(e) {
	      var _this2 = this;

	      // Workaround Chrome and Safari bug https://bugs.chromium.org/p/chromium/issues/detail?id=779328
	      // (onFocus event target selectionStart is always 0 before setTimeout)
	      e.persist();
	      setTimeout(function () {
	        var el = e.target;
	        var selectionStart = el.selectionStart,
	            value = el.value;


	        var caretPosition = _this2.correctCaretPosition(value, selectionStart);
	        if (caretPosition !== selectionStart) {
	          _this2.setPatchedCaretPosition(el, caretPosition, value);
	        }

	        _this2.props.onFocus(e);
	      }, 0);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props11 = this.props,
	          type = _props11.type,
	          displayType = _props11.displayType,
	          customInput = _props11.customInput,
	          renderText = _props11.renderText,
	          getInputRef = _props11.getInputRef;
	      var value = this.state.value;


	      var otherProps = (0, _utils.omit)(this.props, propTypes);

	      var inputProps = _extends({}, otherProps, {
	        type: type,
	        value: value,
	        onChange: this.onChange,
	        onKeyDown: this.onKeyDown,
	        onMouseUp: this.onMouseUp,
	        onFocus: this.onFocus,
	        onBlur: this.onBlur
	      });

	      if (displayType === 'text') {
	        return renderText ? renderText(value) || null : _react2.default.createElement(
	          'span',
	          _extends({}, otherProps, { ref: getInputRef }),
	          value
	        );
	      } else if (customInput) {
	        var CustomInput = customInput;
	        return _react2.default.createElement(CustomInput, inputProps);
	      }

	      return _react2.default.createElement('input', _extends({}, inputProps, {
	        ref: getInputRef
	      }));
	    }
	  }]);

	  return NumberFormat;
	}(_react2.default.Component);

	NumberFormat.propTypes = propTypes;
	NumberFormat.defaultProps = defaultProps;

	module.exports = NumberFormat;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	if (false) {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(3)();
	}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);
	var invariant = __webpack_require__(5);
	var ReactPropTypesSecret = __webpack_require__(6);

	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
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
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (false) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.noop = noop;
	exports.returnTrue = returnTrue;
	exports.charIsNumber = charIsNumber;
	exports.escapeRegExp = escapeRegExp;
	exports.splitDecimal = splitDecimal;
	exports.fixLeadingZero = fixLeadingZero;
	exports.limitToScale = limitToScale;
	exports.roundToPrecision = roundToPrecision;
	exports.omit = omit;
	exports.setCaretPosition = setCaretPosition;
	exports.findChangedIndex = findChangedIndex;


	// basic noop function
	function noop() {}
	function returnTrue() {
	  return true;
	}

	function charIsNumber(char) {
	  return !!(char || '').match(/\d/);
	}

	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	//spilt a float number into different parts beforeDecimal, afterDecimal, and negation
	function splitDecimal(numStr) {
	  var allowNegative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	  var hasNagation = numStr[0] === '-';
	  var addNegation = hasNagation && allowNegative;
	  numStr = numStr.replace('-', '');

	  var parts = numStr.split('.');
	  var beforeDecimal = parts[0];
	  var afterDecimal = parts[1] || '';

	  return {
	    beforeDecimal: beforeDecimal,
	    afterDecimal: afterDecimal,
	    hasNagation: hasNagation,
	    addNegation: addNegation
	  };
	}

	function fixLeadingZero(numStr) {
	  if (!numStr) return numStr;
	  var isNegative = numStr[0] === '-';
	  if (isNegative) numStr = numStr.substring(1, numStr.length);
	  var parts = numStr.split('.');
	  var beforeDecimal = parts[0].replace(/^0+/, '') || '0';
	  var afterDecimal = parts[1] || '';

	  return '' + (isNegative ? '-' : '') + beforeDecimal + (afterDecimal ? '.' + afterDecimal : '');
	}

	/**
	 * limit decimal numbers to given scale
	 * Not used .fixedTo because that will break with big numbers
	 */
	function limitToScale(numStr, scale, fixedDecimalScale) {
	  var str = '';
	  var filler = fixedDecimalScale ? '0' : '';
	  for (var i = 0; i <= scale - 1; i++) {
	    str += numStr[i] || filler;
	  }
	  return str;
	}

	/**
	 * This method is required to round prop value to given scale.
	 * Not used .round or .fixedTo because that will break with big numbers
	 */
	function roundToPrecision(numStr, scale, fixedDecimalScale) {
	  var shoudHaveDecimalSeparator = numStr.indexOf('.') !== -1 && scale;

	  var _splitDecimal = splitDecimal(numStr),
	      beforeDecimal = _splitDecimal.beforeDecimal,
	      afterDecimal = _splitDecimal.afterDecimal,
	      hasNagation = _splitDecimal.hasNagation;

	  var roundedDecimalParts = parseFloat('0.' + (afterDecimal || '0')).toFixed(scale).split('.');
	  var intPart = beforeDecimal.split('').reverse().reduce(function (roundedStr, current, idx) {
	    if (roundedStr.length > idx) {
	      return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
	    }
	    return current + roundedStr;
	  }, roundedDecimalParts[0]);

	  var decimalPart = limitToScale(roundedDecimalParts[1] || '', (afterDecimal || '').length, fixedDecimalScale);
	  var negation = hasNagation ? '-' : '';
	  var decimalSeparator = shoudHaveDecimalSeparator ? '.' : '';
	  return '' + negation + intPart + decimalSeparator + decimalPart;
	}

	function omit(obj, keyMaps) {
	  var filteredObj = {};
	  Object.keys(obj).forEach(function (key) {
	    if (!keyMaps[key]) filteredObj[key] = obj[key];
	  });
	  return filteredObj;
	}

	/** set the caret positon in an input field **/
	function setCaretPosition(el, caretPos) {
	  el.value = el.value;
	  // ^ this is used to not only get "focus", but
	  // to make sure we don't have it everything -selected-
	  // (it causes an issue in chrome, and having it doesn't hurt any other browser)
	  if (el !== null) {
	    if (el.createTextRange) {
	      var range = el.createTextRange();
	      range.move('character', caretPos);
	      range.select();
	      return true;
	    }
	    // (el.selectionStart === 0 added for Firefox bug)
	    if (el.selectionStart || el.selectionStart === 0) {
	      el.focus();
	      el.setSelectionRange(caretPos, caretPos);
	      return true;
	    }

	    // fail city, fortunately this never happens (as far as I've tested) :)
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
	  var i = 0,
	      j = 0;
	  var prevLength = prevValue.length;
	  var newLength = newValue.length;
	  while (prevValue[i] === newValue[i]) {
	    i++;
	  } //check what has been changed from last
	  while (prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j]) {
	    j++;
	  }return { start: i, end: prevLength - j };
	}

/***/ })
/******/ ])
});
;