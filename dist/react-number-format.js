/*!
 * react-number-format - 2.0.4
 * Author : Sudhanshu Yadav
 * Copyright (c) 2016,2017 to Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
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
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function noop() {}

	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function removeLeadingZero(numStr) {
	  //remove leading zeros
	  return numStr.replace(/^0+/, '') || '0';
	}

	/**
	 * limit decimal numbers to given precision
	 * Not used .fixedTo because that will break with big numbers
	 */
	function limitToPrecision(numStr, precision) {
	  var str = '';
	  for (var i = 0; i <= precision - 1; i++) {
	    str += numStr[i] || '0';
	  }
	  return str;
	}

	/**
	 * This method is required to round prop value to given precision.
	 * Not used .round or .fixedTo because that will break with big numbers
	 */
	function roundToPrecision(numStr, precision) {
	  var numberParts = numStr.split('.');
	  var roundedDecimalParts = parseFloat('0.' + (numberParts[1] || '0')).toFixed(precision).split('.');
	  var intPart = numberParts[0].split('').reverse().reduce(function (roundedStr, current, idx) {
	    if (roundedStr.length > idx) {
	      return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
	    }
	    return current + roundedStr;
	  }, roundedDecimalParts[0]);

	  var decimalPart = roundedDecimalParts[1];

	  return intPart + (decimalPart ? '.' + decimalPart : '');
	}

	function omit(obj, keyMaps) {
	  var filteredObj = {};
	  Object.keys(obj).forEach(function (key) {
	    if (!keyMaps[key]) filteredObj[key] = obj[key];
	  });
	  return filteredObj;
	}

	var propTypes = {
	  thousandSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf([true])]),
	  decimalSeparator: _propTypes2.default.string,
	  decimalPrecision: _propTypes2.default.number,
	  displayType: _propTypes2.default.oneOf(['input', 'text']),
	  prefix: _propTypes2.default.string,
	  suffix: _propTypes2.default.string,
	  format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	  mask: _propTypes2.default.string,
	  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	  customInput: _propTypes2.default.func,
	  allowNegative: _propTypes2.default.bool,
	  onKeyDown: _propTypes2.default.func,
	  onMouseUp: _propTypes2.default.func,
	  onChange: _propTypes2.default.func,
	  type: _propTypes2.default.oneOf(['text', 'tel']),
	  isAllowed: _propTypes2.default.func
	};

	var defaultProps = {
	  displayType: 'input',
	  decimalSeparator: '.',
	  prefix: '',
	  suffix: '',
	  allowNegative: true,
	  type: 'text',
	  onChange: noop,
	  onKeyDown: noop,
	  onMouseUp: noop,
	  isAllowed: function isAllowed() {
	    return true;
	  }
	};

	var NumberFormat = function (_React$Component) {
	  _inherits(NumberFormat, _React$Component);

	  function NumberFormat(props) {
	    _classCallCheck(this, NumberFormat);

	    var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

	    var value = _this.optimizeValueProp(props);
	    _this.state = {
	      value: _this.formatInput(value).formattedValue
	    };
	    _this.onChange = _this.onChange.bind(_this);
	    _this.onKeyDown = _this.onKeyDown.bind(_this);
	    _this.onMouseUp = _this.onMouseUp.bind(_this);
	    return _this;
	  }

	  _createClass(NumberFormat, [{
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      this.updateValueIfRequired(prevProps, prevState);
	    }
	  }, {
	    key: 'updateValueIfRequired',
	    value: function updateValueIfRequired(prevProps) {
	      var props = this.props,
	          state = this.state;


	      if (prevProps !== props) {
	        var stateValue = state.value;

	        var value = this.optimizeValueProp(props);
	        if (value === undefined) value = stateValue;

	        var _formatInput = this.formatInput(value),
	            formattedValue = _formatInput.formattedValue;

	        if (formattedValue !== stateValue) {
	          this.setState({
	            value: formattedValue
	          });
	        }
	      }
	    }
	  }, {
	    key: 'getFloatString',
	    value: function getFloatString(num, props) {
	      props = props || this.props;

	      var _getSeparators = this.getSeparators(props),
	          decimalSeparator = _getSeparators.decimalSeparator,
	          thousandSeparator = _getSeparators.thousandSeparator;

	      return (num || '').replace(new RegExp(escapeRegExp(thousandSeparator || ''), 'g'), '').replace(decimalSeparator, '.');
	    }
	  }, {
	    key: 'getFloatValue',
	    value: function getFloatValue(num, props) {
	      props = props || this.props;
	      return parseFloat(this.getFloatString(num, props)) || 0;
	    }
	  }, {
	    key: 'optimizeValueProp',
	    value: function optimizeValueProp(props) {
	      var _getSeparators2 = this.getSeparators(props),
	          decimalSeparator = _getSeparators2.decimalSeparator;

	      var decimalPrecision = props.decimalPrecision,
	          format = props.format;
	      var value = props.value;


	      if (format || !(value || value === 0)) return value;

	      var isNumber = typeof value === 'number';

	      if (isNumber) value = value.toString();

	      value = this.removePrefixAndSuffix(isNumber ? value : this.getFloatString(value, props), props);

	      //round off value
	      if (typeof decimalPrecision === 'number') value = roundToPrecision(value, decimalPrecision);

	      //correct decimal separator
	      if (decimalSeparator) {
	        value = value.replace('.', decimalSeparator);
	      }

	      //throw error if value has two decimal seperators
	      if (value.split(decimalSeparator).length > 2) {
	        throw new Error('\n          Wrong input for value props.\n\n          More than one decimalSeparator found\n       ');
	      }

	      //if decimalPrecision is 0 remove decimalNumbers
	      if (decimalPrecision === 0) return value.split(decimalSeparator)[0];

	      return value;
	    }
	  }, {
	    key: 'removePrefixAndSuffix',
	    value: function removePrefixAndSuffix(val, props) {
	      var format = props.format,
	          prefix = props.prefix,
	          suffix = props.suffix;

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
	    key: 'getSeparators',
	    value: function getSeparators(props) {
	      props = props || this.props;

	      var _props = props,
	          decimalSeparator = _props.decimalSeparator;
	      var _props2 = props,
	          thousandSeparator = _props2.thousandSeparator;


	      if (thousandSeparator === true) {
	        thousandSeparator = ',';
	      }

	      if (decimalSeparator === thousandSeparator) {
	        throw new Error('\n          Decimal separator can\'t be same as thousand separator.\n\n          thousandSeparator: ' + thousandSeparator + ' (thousandSeparator = {true} is same as thousandSeparator = ",")\n          decimalSeparator: ' + decimalSeparator + ' (default value for decimalSeparator is .)\n       ');
	      }

	      return {
	        decimalSeparator: decimalSeparator,
	        thousandSeparator: thousandSeparator
	      };
	    }
	  }, {
	    key: 'getNumberRegex',
	    value: function getNumberRegex(g, ignoreDecimalSeparator) {
	      var _props3 = this.props,
	          format = _props3.format,
	          decimalPrecision = _props3.decimalPrecision;

	      var _getSeparators3 = this.getSeparators(),
	          decimalSeparator = _getSeparators3.decimalSeparator;

	      return new RegExp('\\d' + (decimalSeparator && decimalPrecision !== 0 && !ignoreDecimalSeparator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
	    }
	  }, {
	    key: 'setCaretPosition',
	    value: function setCaretPosition(el, caretPos) {
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
	  }, {
	    key: 'setPatchedCaretPosition',
	    value: function setPatchedCaretPosition(el, caretPos, currentValue) {
	      var _this2 = this;

	      /*
	      setting caret position within timeout of 0ms is required for mobile chrome,
	      otherwise browser resets the caret position after we set it
	      We are also setting it without timeout so that in normal browser we don't see the flickering
	      */
	      this.setCaretPosition(el, caretPos);
	      setTimeout(function () {
	        if (el.value === currentValue) _this2.setCaretPosition(el, caretPos);
	      }, 0);
	    }

	    /* This keeps the caret within typing area so people can't type in between prefix or suffix */

	  }, {
	    key: 'correctCaretPosition',
	    value: function correctCaretPosition(value, caretPos) {
	      var _props4 = this.props,
	          prefix = _props4.prefix,
	          suffix = _props4.suffix;

	      return Math.min(Math.max(caretPos, prefix.length), value.length - suffix.length);
	    }
	  }, {
	    key: 'formatWithPattern',
	    value: function formatWithPattern(str) {
	      var _props5 = this.props,
	          format = _props5.format,
	          mask = _props5.mask;

	      if (!format) return str;
	      var hashCount = format.split('#').length - 1;
	      var hashIdx = 0;
	      var frmtdStr = format;

	      for (var i = 0, ln = str.length; i < ln; i++) {
	        if (i < hashCount) {
	          hashIdx = frmtdStr.indexOf('#');
	          frmtdStr = frmtdStr.replace('#', str[i]);
	        }
	      }

	      var lastIdx = frmtdStr.lastIndexOf('#');

	      if (mask) {
	        return frmtdStr.replace(/#/g, mask);
	      }
	      return frmtdStr.substring(0, hashIdx + 1) + (lastIdx !== -1 ? frmtdStr.substring(lastIdx + 1, frmtdStr.length) : '');
	    }
	  }, {
	    key: 'formatInput',
	    value: function formatInput(val) {
	      var props = this.props,
	          removePrefixAndSuffix = this.removePrefixAndSuffix;
	      var prefix = props.prefix,
	          suffix = props.suffix,
	          mask = props.mask,
	          format = props.format,
	          allowNegative = props.allowNegative,
	          decimalPrecision = props.decimalPrecision;

	      var _getSeparators4 = this.getSeparators(),
	          thousandSeparator = _getSeparators4.thousandSeparator,
	          decimalSeparator = _getSeparators4.decimalSeparator;

	      var maskPattern = format && typeof format == 'string' && !!mask;
	      var numRegex = this.getNumberRegex(true);
	      var hasNegative = void 0,
	          removeNegative = void 0;

	      //change val to string if its number
	      if (typeof val === 'number') val = val + '';

	      var negativeRegex = new RegExp('(-)');
	      var doubleNegativeRegex = new RegExp('(-)(.)*(-)');

	      //check if it has negative numbers
	      if (allowNegative && !format) {
	        // Check number has '-' value
	        hasNegative = negativeRegex.test(val);
	        // Check number has 2 or more '-' values
	        removeNegative = doubleNegativeRegex.test(val);
	      }

	      //remove prefix and suffix
	      val = removePrefixAndSuffix(val, props);

	      var valMatch = val && val.match(numRegex);

	      if (!valMatch && removeNegative) {
	        return { value: '', formattedValue: '' };
	      } else if (!valMatch && hasNegative) {
	        return { value: '', formattedValue: '-' };
	      } else if (!valMatch) {
	        return { value: '', formattedValue: maskPattern ? '' : '' };
	      }

	      var num = val.match(numRegex).join('');

	      var formattedValue = num;

	      if (format) {
	        if (typeof format == 'string') {
	          formattedValue = this.formatWithPattern(formattedValue);
	        } else if (typeof format == 'function') {
	          formattedValue = format(formattedValue);
	        }
	      } else {
	        var hasDecimalSeparator = formattedValue.indexOf(decimalSeparator) !== -1 || decimalPrecision;

	        var parts = formattedValue.split(decimalSeparator);
	        var beforeDecimal = parts[0];
	        var afterDecimal = parts[1] || '';

	        //remove leading zeros from number before decimal
	        beforeDecimal = removeLeadingZero(beforeDecimal);

	        //apply decimal precision if its defined
	        if (decimalPrecision !== undefined) afterDecimal = limitToPrecision(afterDecimal, decimalPrecision);

	        if (thousandSeparator) {
	          beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
	        }

	        //add prefix and suffix
	        if (prefix) beforeDecimal = prefix + beforeDecimal;
	        if (suffix) afterDecimal = afterDecimal + suffix;

	        if (hasNegative && !removeNegative) beforeDecimal = '-' + beforeDecimal;

	        formattedValue = beforeDecimal + (hasDecimalSeparator && decimalSeparator || '') + afterDecimal;
	      }

	      return {
	        value: (hasNegative && !removeNegative ? '-' : '') + removePrefixAndSuffix(formattedValue, props).match(numRegex).join(''),
	        formattedValue: formattedValue
	      };
	    }
	  }, {
	    key: 'getCaretPosition',
	    value: function getCaretPosition(inputValue, formattedValue, caretPos) {
	      var numRegex = this.getNumberRegex(true);
	      var inputNumber = (inputValue.match(numRegex) || []).join('');
	      var formattedNumber = (formattedValue.match(numRegex) || []).join('');
	      var j = void 0,
	          i = void 0;

	      j = 0;

	      for (i = 0; i < caretPos; i++) {
	        var currentInputChar = inputValue[i];
	        var currentFormatChar = formattedValue[j] || '';
	        //no need to increase new cursor position if formatted value does not have those characters
	        //case inputValue = 1a23 and formattedValue =  123
	        if (!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue;

	        //When we are striping out leading zeros maintain the new cursor position
	        //Case inputValue = 00023 and formattedValue = 23;
	        if (currentInputChar === '0' && currentFormatChar.match(numRegex) && currentFormatChar !== '0' && inputNumber.length !== formattedNumber.length) continue;

	        //we are not using currentFormatChar because j can change here
	        while (currentInputChar !== formattedValue[j] && !(formattedValue[j] || '').match(numRegex) && j < formattedValue.length) {
	          j++;
	        }j++;
	      }

	      //correct caret position if its outsize of editable area
	      j = this.correctCaretPosition(formattedValue, j);

	      return j;
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

	      var lastValue = state.value;

	      var _formatInput2 = this.formatInput(inputValue),
	          formattedValue = _formatInput2.formattedValue,
	          value = _formatInput2.value; // eslint-disable-line prefer-const

	      /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/


	      var currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

	      var valueObj = {
	        formattedValue: formattedValue,
	        value: value,
	        floatValue: this.getFloatValue(value)
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
	        this.setState({ value: formattedValue }, function () {
	          props.onChange(e, valueObj);
	        });
	      }

	      return value;
	    }
	  }, {
	    key: 'onKeyDown',
	    value: function onKeyDown(e) {
	      var el = e.target;
	      var selectionEnd = el.selectionEnd,
	          value = el.value;
	      var selectionStart = el.selectionStart;
	      var _props6 = this.props,
	          decimalPrecision = _props6.decimalPrecision,
	          prefix = _props6.prefix,
	          suffix = _props6.suffix;
	      var key = e.key;

	      var numRegex = this.getNumberRegex(false, decimalPrecision !== undefined);
	      var negativeRegex = new RegExp('-');

	      //Handle backspace and delete against non numerical/decimal characters
	      if (selectionStart === selectionEnd) {
	        var newCaretPosition = selectionStart;

	        if (key === 'ArrowLeft' || key === 'ArrowRight') {
	          selectionStart += key === 'ArrowLeft' ? -1 : +1;
	          newCaretPosition = this.correctCaretPosition(value, selectionStart);
	        } else if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
	          while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < value.length - suffix.length) {
	            newCaretPosition++;
	          }
	        } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart - 1])) {
	          while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > prefix.length) {
	            newCaretPosition--;
	          }
	        }

	        if (newCaretPosition !== selectionStart) {
	          e.preventDefault();
	          this.setPatchedCaretPosition(el, newCaretPosition, value);
	        }
	      }

	      this.props.onKeyDown(e);
	    }
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
	    key: 'render',
	    value: function render() {
	      var props = omit(this.props, propTypes);

	      var inputProps = _extends({}, props, {
	        type: this.props.type,
	        value: this.state.value,
	        onChange: this.onChange,
	        onKeyDown: this.onKeyDown,
	        onMouseUp: this.onMouseUp
	      });

	      if (this.props.displayType === 'text') {
	        return _react2.default.createElement(
	          'span',
	          props,
	          this.state.value
	        );
	      } else if (this.props.customInput) {
	        var CustomInput = this.props.customInput;
	        return _react2.default.createElement(CustomInput, inputProps);
	      }

	      return _react2.default.createElement('input', inputProps);
	    }
	  }]);

	  return NumberFormat;
	}(_react2.default.Component);

	NumberFormat.propTypes = propTypes;
	NumberFormat.defaultProps = defaultProps;

	module.exports = NumberFormat;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
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
	    shape: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
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

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }
/******/ ])
});
;