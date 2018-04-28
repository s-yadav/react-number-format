/*!
 * react-number-format - 3.3.4
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_97__) {
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

	var _extends2 = __webpack_require__(2);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(40);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(45);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(46);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(50);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(84);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _propTypes = __webpack_require__(92);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _react = __webpack_require__(97);

	var _react2 = _interopRequireDefault(_react);

	var _utils = __webpack_require__(98);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	  allowEmptyFormatting: _propTypes2.default.bool,
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
	  allowEmptyFormatting: false,
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
	  (0, _inherits3.default)(NumberFormat, _React$Component);

	  function NumberFormat(props) {
	    (0, _classCallCheck3.default)(this, NumberFormat);

	    //validate props
	    var _this = (0, _possibleConstructorReturn3.default)(this, (NumberFormat.__proto__ || (0, _getPrototypeOf2.default)(NumberFormat)).call(this, props));

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

	  (0, _createClass3.default)(NumberFormat, [{
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
	      var decimalScale = this.props.decimalScale;

	      var _getSeparators = this.getSeparators(),
	          decimalSeparator = _getSeparators.decimalSeparator;

	      var numRegex = this.getNumberRegex(true);

	      //remove negation for regex check
	      var hasNegation = num[0] === '-';
	      if (hasNegation) num = num.replace('-', '');

	      //if decimal scale is zero remove decimal and number after decimalSeparator
	      if (decimalSeparator && decimalScale === 0) {
	        num = num.split(decimalSeparator)[0];
	      }

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

	      //if value is empty return 0

	      if (value === '') return 0;

	      //caret position should be between 0 and value length
	      caretPos = (0, _utils.clamp)(caretPos, 0, value.length);

	      //in case of format as number limit between prefix and suffix
	      if (!format) {
	        var hasNegation = value[0] === '-';
	        return (0, _utils.clamp)(caretPos, prefix.length + (hasNegation ? 1 : 0), value.length - suffix.length);
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
	      caretPos = (0, _utils.clamp)(caretPos, firstHashPosition, lastHashPosition + 1);

	      var nextPos = format.substring(caretPos, format.length).indexOf('#');
	      var caretLeftBound = caretPos;
	      var caretRightBound = caretPos + (nextPos === -1 ? 0 : nextPos);

	      //get the position where the last number is present
	      while (caretLeftBound > firstHashPosition && (format[caretLeftBound] !== '#' || !(0, _utils.charIsNumber)(value[caretLeftBound]))) {
	        caretLeftBound -= 1;
	      }

	      var goToLeft = !(0, _utils.charIsNumber)(value[caretRightBound]) || direction === 'left' && caretPos !== firstHashPosition || caretPos - caretLeftBound < caretRightBound - caretPos;

	      if (goToLeft) {
	        //check if number should be taken after the bound or after it
	        //if number preceding a valid number keep it after
	        return (0, _utils.charIsNumber)(value[caretLeftBound]) ? caretLeftBound + 1 : caretLeftBound;
	      }

	      return caretRightBound;
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
	      var _props6 = this.props,
	          format = _props6.format,
	          allowEmptyFormatting = _props6.allowEmptyFormatting;

	      var formattedValue = value;

	      if (value === '' && !allowEmptyFormatting) {
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
	      var _props7 = this.props,
	          format = _props7.format,
	          decimalScale = _props7.decimalScale,
	          fixedDecimalScale = _props7.fixedDecimalScale,
	          allowEmptyFormatting = _props7.allowEmptyFormatting;
	      var _props8 = this.props,
	          value = _props8.value,
	          isNumericString = _props8.isNumericString;


	      if (value === undefined && allowEmptyFormatting) {
	        value = '';
	      }

	      // if value is not defined return empty string
	      if (value === undefined && !allowEmptyFormatting) return '';

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
	      var _props9 = this.props,
	          format = _props9.format,
	          prefix = _props9.prefix,
	          suffix = _props9.suffix,
	          decimalScale = _props9.decimalScale,
	          fixedDecimalScale = _props9.fixedDecimalScale;

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
	      var _props10 = this.props,
	          format = _props10.format,
	          decimalSeparator = _props10.decimalSeparator,
	          allowNegative = _props10.allowNegative;

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
	          props.onValueChange(valueObj, e);
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
	            props.onValueChange(valueObj, e);
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
	          _el$value = el.value,
	          value = _el$value === undefined ? '' : _el$value;

	      var expectedCaretPosition = void 0;
	      var _props11 = this.props,
	          decimalScale = _props11.decimalScale,
	          fixedDecimalScale = _props11.fixedDecimalScale,
	          prefix = _props11.prefix,
	          suffix = _props11.suffix,
	          format = _props11.format,
	          onKeyDown = _props11.onKeyDown;

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

	      /** 
	       * NOTE: we have to give default value for value as in case when custom input is provided 
	       * value can come as undefined when nothing is provided on value prop.
	      */
	      var selectionStart = el.selectionStart,
	          selectionEnd = el.selectionEnd,
	          _el$value2 = el.value,
	          value = _el$value2 === undefined ? '' : _el$value2;


	      if (selectionStart === selectionEnd) {
	        var caretPosition = this.correctCaretPosition(value, selectionStart);
	        if (caretPosition !== selectionStart) {
	          this.setPatchedCaretPosition(el, caretPosition, value);
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
	            _el$value3 = el.value,
	            value = _el$value3 === undefined ? '' : _el$value3;


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
	      var _props12 = this.props,
	          type = _props12.type,
	          displayType = _props12.displayType,
	          customInput = _props12.customInput,
	          renderText = _props12.renderText,
	          getInputRef = _props12.getInputRef;
	      var value = this.state.value;


	      var otherProps = (0, _utils.omit)(this.props, propTypes);

	      var inputProps = (0, _extends3.default)({}, otherProps, {
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
	          (0, _extends3.default)({}, otherProps, { ref: getInputRef }),
	          value
	        );
	      } else if (customInput) {
	        var CustomInput = customInput;
	        return _react2.default.createElement(CustomInput, inputProps);
	      }

	      return _react2.default.createElement('input', (0, _extends3.default)({}, inputProps, {
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

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	module.exports = __webpack_require__(8).Object.assign;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(6);

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(21) });


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var core = __webpack_require__(8);
	var ctx = __webpack_require__(9);
	var hide = __webpack_require__(11);
	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.1' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(12);
	var createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(16) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(13);
	var IE8_DOM_DEFINE = __webpack_require__(15);
	var toPrimitive = __webpack_require__(19);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function () {
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	var document = __webpack_require__(7).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__(22);
	var gOPS = __webpack_require__(37);
	var pIE = __webpack_require__(38);
	var toObject = __webpack_require__(39);
	var IObject = __webpack_require__(26);
	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(17)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(23);
	var enumBugKeys = __webpack_require__(36);

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(24);
	var toIObject = __webpack_require__(25);
	var arrayIndexOf = __webpack_require__(29)(false);
	var IE_PROTO = __webpack_require__(33)('IE_PROTO');

	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(26);
	var defined = __webpack_require__(28);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(25);
	var toLength = __webpack_require__(30);
	var toAbsoluteIndex = __webpack_require__(32);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(31);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(34)('keys');
	var uid = __webpack_require__(35);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(41), __esModule: true };

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(42);
	module.exports = __webpack_require__(8).Object.getPrototypeOf;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(39);
	var $getPrototypeOf = __webpack_require__(43);

	__webpack_require__(44)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(24);
	var toObject = __webpack_require__(39);
	var IE_PROTO = __webpack_require__(33)('IE_PROTO');
	var ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(6);
	var core = __webpack_require__(8);
	var fails = __webpack_require__(17);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(47);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(48), __esModule: true };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49);
	var $Object = __webpack_require__(8).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(16), 'Object', { defineProperty: __webpack_require__(12).f });


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(51);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(52);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(71);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(53), __esModule: true };

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(54);
	__webpack_require__(66);
	module.exports = __webpack_require__(70).f('iterator');


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(55)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(56)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31);
	var defined = __webpack_require__(28);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(57);
	var $export = __webpack_require__(6);
	var redefine = __webpack_require__(58);
	var hide = __webpack_require__(11);
	var has = __webpack_require__(24);
	var Iterators = __webpack_require__(59);
	var $iterCreate = __webpack_require__(60);
	var setToStringTag = __webpack_require__(64);
	var getPrototypeOf = __webpack_require__(43);
	var ITERATOR = __webpack_require__(65)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

	module.exports = true;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);


/***/ }),
/* 59 */
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(61);
	var descriptor = __webpack_require__(20);
	var setToStringTag = __webpack_require__(64);
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(11)(IteratorPrototype, __webpack_require__(65)('iterator'), function () { return this; });

	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(13);
	var dPs = __webpack_require__(62);
	var enumBugKeys = __webpack_require__(36);
	var IE_PROTO = __webpack_require__(33)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(18)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(63).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(12);
	var anObject = __webpack_require__(13);
	var getKeys = __webpack_require__(22);

	module.exports = __webpack_require__(16) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(7).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f;
	var has = __webpack_require__(24);
	var TAG = __webpack_require__(65)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(34)('wks');
	var uid = __webpack_require__(35);
	var Symbol = __webpack_require__(7).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(67);
	var global = __webpack_require__(7);
	var hide = __webpack_require__(11);
	var Iterators = __webpack_require__(59);
	var TO_STRING_TAG = __webpack_require__(65)('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = global[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(68);
	var step = __webpack_require__(69);
	var Iterators = __webpack_require__(59);
	var toIObject = __webpack_require__(25);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(56)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ }),
/* 68 */
/***/ (function(module, exports) {

	module.exports = function () { /* empty */ };


/***/ }),
/* 69 */
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(65);


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(73);
	__webpack_require__(81);
	__webpack_require__(82);
	__webpack_require__(83);
	module.exports = __webpack_require__(8).Symbol;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(7);
	var has = __webpack_require__(24);
	var DESCRIPTORS = __webpack_require__(16);
	var $export = __webpack_require__(6);
	var redefine = __webpack_require__(58);
	var META = __webpack_require__(74).KEY;
	var $fails = __webpack_require__(17);
	var shared = __webpack_require__(34);
	var setToStringTag = __webpack_require__(64);
	var uid = __webpack_require__(35);
	var wks = __webpack_require__(65);
	var wksExt = __webpack_require__(70);
	var wksDefine = __webpack_require__(75);
	var enumKeys = __webpack_require__(76);
	var isArray = __webpack_require__(77);
	var anObject = __webpack_require__(13);
	var toIObject = __webpack_require__(25);
	var toPrimitive = __webpack_require__(19);
	var createDesc = __webpack_require__(20);
	var _create = __webpack_require__(61);
	var gOPNExt = __webpack_require__(78);
	var $GOPD = __webpack_require__(80);
	var $DP = __webpack_require__(12);
	var $keys = __webpack_require__(22);
	var gOPD = $GOPD.f;
	var dP = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global.Symbol;
	var $JSON = global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function () { return dP(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(79).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(38).f = $propertyIsEnumerable;
	  __webpack_require__(37).f = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(57)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    replacer = args[1];
	    if (typeof replacer == 'function') $replacer = replacer;
	    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
	      if ($replacer) value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	var META = __webpack_require__(35)('meta');
	var isObject = __webpack_require__(14);
	var has = __webpack_require__(24);
	var setDesc = __webpack_require__(12).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(17)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var core = __webpack_require__(8);
	var LIBRARY = __webpack_require__(57);
	var wksExt = __webpack_require__(70);
	var defineProperty = __webpack_require__(12).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(22);
	var gOPS = __webpack_require__(37);
	var pIE = __webpack_require__(38);
	module.exports = function (it) {
	  var result = getKeys(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(25);
	var gOPN = __webpack_require__(79).f;
	var toString = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(23);
	var hiddenKeys = __webpack_require__(36).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(38);
	var createDesc = __webpack_require__(20);
	var toIObject = __webpack_require__(25);
	var toPrimitive = __webpack_require__(19);
	var has = __webpack_require__(24);
	var IE8_DOM_DEFINE = __webpack_require__(15);
	var gOPD = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(16) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

	

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(75)('asyncIterator');


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(75)('observable');


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(85);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(89);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(51);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(87);
	module.exports = __webpack_require__(8).Object.setPrototypeOf;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(6);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(88).set });


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(14);
	var anObject = __webpack_require__(13);
	var check = function (O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = __webpack_require__(9)(Function.call, __webpack_require__(80).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(91);
	var $Object = __webpack_require__(8).Object;
	module.exports = function create(P, D) {
	  return $Object.create(P, D);
	};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(61) });


/***/ }),
/* 92 */
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
	  module.exports = __webpack_require__(93)();
	}


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(94);
	var invariant = __webpack_require__(95);
	var ReactPropTypesSecret = __webpack_require__(96);

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
/* 94 */
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
/* 95 */
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
/* 96 */
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
/* 97 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_97__;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(99);

	var _keys2 = _interopRequireDefault(_keys);

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
	exports.clamp = clamp;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	  //if number is empty don't do anything return empty string
	  if (numStr === '') return '';

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

	  var decimalPart = limitToScale(roundedDecimalParts[1] || '', Math.min(scale, afterDecimal.length), fixedDecimalScale);
	  var negation = hasNagation ? '-' : '';
	  var decimalSeparator = shoudHaveDecimalSeparator ? '.' : '';
	  return '' + negation + intPart + decimalSeparator + decimalPart;
	}

	function omit(obj, keyMaps) {
	  var filteredObj = {};
	  (0, _keys2.default)(obj).forEach(function (key) {
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
	  while (prevValue[i] === newValue[i] && i < prevLength) {
	    i++;
	  } //check what has been changed from last
	  while (prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j] && newLength - j > i && prevLength - j > i) {
	    j++;
	  }

	  return { start: i, end: prevLength - j };
	}

	/*
	  Returns a number whose value is limited to the given range
	*/
	function clamp(num, min, max) {
	  return Math.min(Math.max(num, min), max);
	}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(100), __esModule: true };

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(101);
	module.exports = __webpack_require__(8).Object.keys;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(39);
	var $keys = __webpack_require__(22);

	__webpack_require__(44)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ })
/******/ ])
});
;